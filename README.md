# shinyNodeProxy


`shinyNodeProxy` is a simple Node.js script for launching a single R shiny application or interactive document within a Node.js process manager: [Phusion passenger](https://www.phusionpassenger.com). Using `shinyNodeProxy` with Phusion Passenger should keep your shiny app alive and  help to solve some shiny-server limitation, shuch as load balancing (html request), SSL connexion or session monitoring. In this project, we use simple shortcut (start.sh, startSSL.sh and stop.sh) to configure and start the application through Phusion passenger. 

This is an experimental project. Please send me a feedback if you think that this module is useful.

For production, please use the official shiny-server or [shiny-server pro](https://www.rstudio.com/products/shiny-server-pro/).

Alternative approaches:
* Load balancing: [A Shiny-app Serves as Shiny-server Load Balancer](http://withr.me/a-shiny-app-serves-as-shiny-server-load-balancer/)

* User auth and ssl: [How to add SSL and user authentication to shiny server using an nignx proxy](http://mbannert.github.io/jekyll/update/2014/02/21/proxied-shiny-server-with-ssl-and-userauth.html)

* Using shiny-server using a proxy: [RStudio Server: Running with a Proxy](https://support.rstudio.com/hc/en-us/articles/200552326-Running-with-a-Proxy)

# Usage 

## Prerequisite

* [unix-like OS](https://en.wikipedia.org/wiki/Unix-like)
* [nodejs + npm](https://nodejs.org/download/)
* [R](http://www.r-project.org/)
* [R package shiny](https://cran.r-project.org/web/packages/shiny/index.html)
* [phusion passenger (optional)](https://www.phusionpassenger.com/download#open_source)


## Installation and quick run

```{sh}
cd ~/yourProjectFolder/
git clone https://github.com/fxi/shinyNodeProxy.git
cd shinyNodeProxy
npm install 
start.sh
```

## Configuration

* Set the path to your R shiny application in `settings/settings.js`

For launching the app in a cluster  with `passenger`, the shell scripts `stop.sh`, `start.sh` and `startSSL.sh` could be use as shortcut and should be configured accordingly to your system.

* SSL certificate could be put in `settings/ssl`. Path can be changed in `startSSL.sh`. 
* Cookie name, number of instance, http port, https port, and a lot more should also be configured in those `start*.sh` shell scripts.

## Testing

You can test your R shiny application without launching a process manager: using R directly or `shinyNodeProxy` only.

### R only

To manually start the shiny application, launch `utils/runApp.R` from the root of this project, with the port to listen and the path to your app:

`Rscript utils/runApp.R 3838 inst/example`

### Node.js only

To start the application with node, use `node` (or `nodejs`) command. This will launch the port detection and the proxy.

`node app.js`

# Structure of a working dir.

```{sh}

.
|-- README.md
|-- app.js # main application
|-- inst # Example of a simple  shiny app 
|   `-- example
|-- log # contains logs
|   |-- REAME.md
|-- node_modules # node modules
|   `-- http-proxy
|-- package.json # app dependencies
|-- public 
|-- settings # settings of the application: path to R shiny app, default port.
|   |-- settings.js
|   |-- settings.js.example
|   `-- ssl # Contains ssl certificate (optional)
|-- start.sh # Shortcut to launch the app whith passenger ( Edit this file to change passenger settings )
|-- startSSL.sh # Launch with ssl ( Edit this file to change passenger and ssl settings )
|-- stop.sh # Stop passenger.
`-- utils
    `-- runApp.R # Lauch R shiny app
```

# Contribution

yes please !





