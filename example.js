var shinyCluster = require('.');

/**
* Launch some instances of the app in utils/app.R
*/
shinyCluster.run({
  port : 3456,
  concurency : 1
});

