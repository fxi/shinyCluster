# lauch app using given port
setwd('appShiny')
if(dir.exists('packrat'))source('packrat/init.R')
args <- commandArgs(TRUE)
port <- as.integer(args[1])
shiny::runApp('.',port=port,launch.browser=FALSE)

