# lauch app using given port

args <- commandArgs(TRUE)

path <- file.path(args[2])
port <- as.integer(args[1])
Sys.setlocale("LC_ALL", 'en_US.UTF-8')

setwd(path)

shiny::runApp(  
  port = port,
  launch.browser = FALSE,
  host = "0.0.0.0"
  )

return(TRUE)
