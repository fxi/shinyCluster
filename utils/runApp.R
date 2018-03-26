# lauch app using given port

args <- commandArgs(TRUE)

port <- as.integer(args[1])
path <- file.path(args[2])
host <- args[3]

Sys.setlocale("LC_ALL", 'en_US.UTF-8')

dirOk <- dir.exists(path);
fileOk <- file.exists(path);
finalPath <- path;

if(!dirOk && fileOk){
  finalPath <- dirname(path)
}

dirFinalOk <- dir.exists(finalPath)

if(dirFinalOk){
  setwd(finalPath)
  shiny::runApp(  
    port = port,
    launch.browser = FALSE,
    host = host
    )
}else{
  stop(paste(path, "not found"))
}

