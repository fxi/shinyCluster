# shinyNodeProxy


`shinyNodeProxy` is a simple node js app to launch R shiny app with the help of a proxy. This should facilitate serving a shiny app with a node js process manager like Phusion Passenger.

Shiny-server serve shiny app very nicely, but the open source version does not allow ssl connection and R process is limited to one by application.

Phusion Passenger can be used to handle ssl connecion, manage load balancing on multiple CPU, use HTTP cache and a lot more. 

This is an experimental project, please feed back if you find this module useful.


# Usage 

## Prerequisite

* unix-like OS
* nodejs + npm
* phusion passenger
* R
* R package shiny


## Install from git repo


```{sh}
cd ~/yourProjectFolder/
git clone https://github.com/fxi/shinyNodeProxy.git
cd shinyNodeProxy
npm install 
```

## Configuration

* Your R shiny app goes in `appShiny` folder
* SSL certificate could be put in `/settings/ssl`
* `passengerStartApp.sh` and `passengerStartAppSsl.sh` contain the command and configuration for starting the app with passenger.


## Testing

### R only

To manually start the application, from the root of the project (expected working dir), lauch utils/runApp.R with the port to listen:

`Rscript utils/runApp.R 3838`

### node only

To start the application with node, use `node` (or `nodejs`) command. This will launch the port detection and the proxy.

`node app.js`

# Structure

```{sh}
.
├── README.md
├── app.js # main application 
├── appShiny
│   └── app.R # R shiny application to serve
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





