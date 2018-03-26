FROM alpine:3.7


ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ARG shiny_cluster_version="0.0.8"
ARG shiny_cluster_port=3467
ARG shiny_cluster_host="0.0.0.0"
ARG shiny_debug_port=3434 
ARG shiny_cluster_concurrency=1
ARG r_sys_build_deps="alpine-sdk R-dev libressl-dev"
ARG r_sys_deps="R"
ARG r_packages_date="2018-03-23"
#ARG r_packages_build="c('Rcpp')"
ARG r_packages="c('Rcpp','shiny')"

ENV path_app="/mnt/app"

WORKDIR /config/shiny-cluster
RUN apk add --no-cache nodejs \
    && apk add --no-cache ${r_sys_deps} \
    && apk add --no-cache --virtual _build_deps ${r_sys_build_deps} \
    && echo "{\"dependencies\": {\"@fxi/shiny-cluster\": \""${shiny_cluster_version}"\"}}" > package.json \
    && echo "require('@fxi/shiny-cluster').run({ \
    path : '"${path_app}"',\
    concurrency : "${shiny_cluster_concurrency}", \
    host : '"${shiny_cluster_host}"', \
    port : "${shiny_cluster_port}" });" > app.js \
    && npm install \
    && npm cache clean --force \
    && npm uninstall -g npm \
    && rm -rf $HOME/.npm \
    && mkdir -p ~/.R/ \
    && echo "CFLAGS=-D__USE_MISC" > ~/.R/Makevars \
    && echo "rep <- getOption('repos') ;\
    rep['CRAN'] <- 'https://mran.microsoft.com/snapshot/"${r_packages_date}"';\
    options(repos = rep); \
    install.packages("${r_packages}")" > install.R \
    && Rscript install.R \
    #&& Rscript -e "remove.packages("${r_packages_build}")" \
    && apk del _build_deps

RUN apk add --no-cache ttf-freefont;

VOLUME /mnt/app
EXPOSE ${shiny_cluster_port}
EXPOSE ${shiny_debug_port}

CMD ["node","app.js"]
