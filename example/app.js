var shinyCluster = require('../.');

/**
* Launch some instances of the app in utils/app.R
*/
shinyCluster.run({
  path : './app.R',
  port : 3456,
  concurrency: 1
});

