# lauch app using given port

args <- commandArgs(TRUE)

appWd = file.path(args[2])
port <- as.integer(args[1])


Sys.setlocale("LC_ALL", 'en_US.UTF-8')

print(sessionInfo())
message(paste('Set working directory to',appWd))
setwd(file.path(args[2]))

if(dir.exists('packrat')){
  message('Packrat found. Initialisation.') 
  source('packrat/init.R')
}

shiny::runApp('.',port=port,launch.browser=FALSE)

