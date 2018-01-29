# lauch app using given port

args <- commandArgs(TRUE)

path <- file.path(args[2])
port <- as.integer(args[1])
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
    host = "0.0.0.0"
    )
}else{
  stop(paste(path, "not found"))
}

