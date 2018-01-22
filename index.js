var net = require('net');
var stickyCluster =  require('sticky-cluster');
var http = require('http');
var path = require('path');
var httpProxy = require('http-proxy');
var config = {
  path : path.join(__dirname,"./example"),
  port : 3333
};

module.exports.run = function(options){
  config = Object.assign({}, config, options);
  config.path = path.resolve(config.path);
  /* display listening port */
  process.stdout.write("shiny-cluster listening to port " + config.port +  '\n');
  stickyCluster(app, config);
};

/**
 * Main app for sticky cluster
 */
function app(callback) {

  var child, pathRunApp, port;

  getPort()
    .then(function(p){
      /**
       * Init R process
       */
      port = p;
      pathRunApp = path.join(__dirname,'utils/runApp.R');
      child = require('child_process')
        .spawn('Rscript', [pathRunApp, port, config.path ]);

      /* handle event */
      child.on('exit', function() {
        process.exit();
      });

      process.on('exit',function(){
        child.kill();
      });

      return Promise.resolve(true);
    }).then(function(){
      /**
       * Test for connection
       */
      var test = "Listening on http://0.0.0.0:" + port;

      return new Promise(function(resolve,reject){
        child.stderr.on('data',function(msg){
          msg = msg.toString();
          if( msg.indexOf(test) > -1){
            resolve(msg);
          }
        });
      }); 

    })
    .then(function(msg){

      console.log(msg);

      /**
       * Launch proxy
       */

      /* pipe msgs */
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);

      var proxy = new httpProxy.createProxyServer({
        target: {
          host: 'localhost',
          port: port
        }
      });

      var proxyServer = http.createServer(function (req, res) {
        res.setHeader("Content-Type", "charset=utf-8");
        proxy.web(req, res);
      });

      // error
      proxy.on('error', function (err, req, res) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('Error in proxy, please retry later.');
        throw err;
      });

      // websocket upgrade
      proxyServer.on('upgrade', function (req, socket, head) {
        proxy.ws(req, socket, head);
      });

      // close
      proxyServer.on('close', function (req, socket, head) {
        console.log('Client disconnected');
      });

      callback(proxyServer);
    });




}


var getPort = module.exports.getPort = function(){
  return new Promise(function(resolve, reject){
    var server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen({port:0},function(){
      var port = server.address().port;
      server.close(function(){
        resolve(port);
      });
    });
  });
};

