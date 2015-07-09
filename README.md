# shinyNodeProxy


`shinyNodeProxy` is a simple Node.js server to launch a single R shiny application or interactive document, through a proxy. Using `shinyNodeProxy` with a process manager (e.g. Phusion Passenger) can provide some advantages over the open source version of shiny-server :

* Load balancing
* Multiple R processes
* SSL connexion
* HTTP caching


This is an experimental project, please send a feed back if you think that this module is useful.


# Usage 

## Prerequisite

* unix-like OS
* nodejs + npm
* phusion passenger
* R
* R package shiny


## Install from git repository

```{sh}
cd ~/yourProjectFolder/
git clone https://github.com/fxi/shinyNodeProxy.git
cd shinyNodeProxy
npm install 
```

## Configuration

* Your R shiny app goes in `appShiny` folder
* SSL certificate could be put in `/settings/ssl`. Path can be changed in `passengerStartApp*` 
* `passengerStartApp.sh` and `passengerStartAppSsl.sh` contain the command and configuration for starting the app with passenger.


## Testing

You can test your R shiny application without launching a process manager: using R directly or `shinyNodeProxy` only.

### R only

To manually start the shiny application, launch utils/runApp.R with the port to listen from the root of this project (expected working dir) with this command:

`Rscript utils/runApp.R 3838`

### Node.js only

To start the application with node, use `node` (or `nodejs`) command. This will launch the port detection and the proxy.

`node app.js`

# Structure

```{sh}
.
├── README.md # This file
├── app.js # Main application 
├── appShiny
│   └── app.R # The R shiny application 
├── log
│   ├── passenger.3000.log # passenger log (file path is defined in startup script)
├── node_modules # node dependencies
│   ├── fs
│   ├── http
│   └── http-proxy
├── package.json # package description
├── passengerStartApp.sh # simple reminder for starting and configure the app with passenger
├── passengerStartAppSsl.sh # same, with ssl support
├── passengerStopApp.sh # stop the application using given PID file (by default, in log folder)
├── public # passenger public folder. Not used yet
├── settings # settings. Empty, but could contain ssl config. Don't share this.
│   └── ssl
└── utils # Helper function
    ├── findNextOpenPort.sh  # Find the next port open to initiate shiny app
    ├── runApp.R # command to lauch R shiny app with given port
    └── testIfPortIsReady.sh # check if the port is ready to listen. Used in loop written in app.js
```

# Contribution

yes please !





