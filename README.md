# shinyCluster

`shinyCluster` is a simple Node.js module for launching a single R shiny application in a cluster of workers and keep track of sessions.

This is an experimental project. Please send me a feedback if you find this script useful.

# Other ways

* For production: use the official shiny-server or [shiny-server pro](https://www.rstudio.com/products/shiny-server-pro/).
* Load balancing: [A Shiny-app Serves as Shiny-server Load Balancer](http://withr.me/a-shiny-app-serves-as-shiny-server-load-balancer/)


# Usage 

## Prerequisite

* [nodejs + npm](https://nodejs.org/download/)
* [R](http://www.r-project.org/)
* [R package shiny](https://cran.r-project.org/web/packages/shiny/index.html)
* [shinyCluster](https://github.com/fxi/shinyCluster)


## Install

```{sh}
npm install @fxi/shiny-cluster --save
```

## Example

Sample app 

```{sh}
node example.js
```

Sample app in a js script

```{js}
var shinyCluster= require('@fxi/shiny-cluster');

/**
 * Launch a simple shiny app
 * located in folder `./utils`,
 * using 3 workers and
 * listen on port 3456
 */
shinyCluster.run({
  path : 'node_module/@fxi/shiny-cluster/utils/',
  concurency : 3,
  port : 3456
});

```
## Contribution

yes please !

# Change logs

0.0.2 -> 0.0.3
 - paths issues

0.0.1 -> 0.0.2 
 - build a node module
 - use sticky-cluster
 - simplify everything

