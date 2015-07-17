# shinyNodeProxy


`shinyNodeProxy` is a minimal Node.js script to launch a single R shiny application or interactive document, through a proxy. Using `shinyNodeProxy` with a process manager (e.g. Phusion Passenger) can provide some advantages over the open source version of shiny-server :

* Load balancing
* Multiple R processes
* SSL connexion
* HTTP caching


This is an experimental project, please send a feedback if you think that this module is useful.


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





