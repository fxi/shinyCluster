# lauch app using given port
library(shiny)
args <- commandArgs(TRUE)
port <- as.integer(args[1])
runApp('appShiny/',port=port,launch.browser=FALSE)
