var net = require('net');
var stickyCluster =  require('sticky-cluster');
var http = require('http');
var path = require('path');
var httpProxy = require('http-proxy');
var config = {
  path : "./utils/",
  port : 3333
};

module.exports.run = function(options){
  config = Object.assign({}, config, options);
  config.path = path.resolve(config.path);
  stickyCluster(app, config);
};

/**
* Main app for sticky cluster
*/
function app(callback) {
  getPort()
    .then(function(port){
      
      var child = require('child_process')
        .spawn('Rscript', [path.resolve('./utils/runApp.R'), port, config.path ]);

      /* pipe msgs */
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);

      child.on('exit', function() {
        process.exit();
      });

      process.on('exit',function(){
        child.kill();
      });

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

