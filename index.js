var net = require('net');
var stickyCluster =  require('sticky-cluster');
var http = require('http');
var path = require('path');
var httpProxy = require('http-proxy');
var config = {
  path : path.join(__dirname,"./example"),
  port : 3333,
  host : "0.0.0.0",
  timeoutListen : 10e3,
  timeoutConnect : 100,
  nTry : 10
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

  var r, pathRunApp, port, listening, listenTimeout ;

  getPort()
    .then(function(p){
   
      return new Promise(function(resolve,reject){
        console.log("Launching R from" +config.path);
        /**
         * Init R process
         */
        port = p;
        listening = false;
        pathRunApp = path.join(__dirname,'utils/runApp.R');
        r = require('child_process')
          .spawn('Rscript', [pathRunApp, port, config.path ]);


        /* pipe msgs */
        console.log("Pipe stdout/err");
        r.stdout.pipe(process.stdout);
        r.stderr.pipe(process.stderr);



        /* handle event */
        r.on('close', function(code) {
          console.log("Spawn closed with code " + code);
          process.exit();
        });

        process.on('close',function(code){
          console.log("Process closed with code " + code);
          r.kill();
        });

        listenTimeout = setTimeout(function(){
          reject(new Error("Connection timeout"));
        },config.timeoutListen);

        r.stderr.on('data',function(d){
          if(listening) return;
          d = d.toString();
          /**
          * Test if shiny app is listening
          * NOTE: this is a weak way of doing it...
          * check shiny-server how this is made
          * 
          */
          if(d.indexOf("Listening on http://" + config.host + ":" + port) > -1 ){
            listening = true;
            clearTimeout(listenTimeout);
              console.log("Listen command read, resolve");
              resolve(port);
          }
        });

      });
    }).then(function(port){
        /**
         * Test for connection
         */
        console.log("Wait on port " + port);
        return waitPort(port,config.host);
    })
    .then(function(port){


      /**
       * Launch proxy
       */
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

      //

      console.log("Shiny-server : listening to port " + config.port);

      callback(proxyServer);

    }).catch(function(err){
      console.log(err);
      process.exit();
    });

}


var getPort = module.exports.getPort = function(){
  return new Promise(function(resolve, reject){
    var server = net.createServer();
    server.unref();
    server.on('error', function(){reject("Failed to get port");});
    server.listen({port:0},function(){
      var port = server.address().port;
      server.close(function(){
        resolve(port);
      });
    });
  });
};

var waitPort = module.exports.waitPort = function(port,host){
  return new Promise(function(resolve, reject){
    var timeout = config.timeoutConnect;
    var nTry = config.nTry;
    var con = null;
    var listen = null;

    test();

    function test(){
      nTry--;
      console.log("Try to connect to " + port + " with " + nTry + " try left");
      if(!listen){

        con = net.connect({ port:port,host:host});

        con.on("error",function(err){
          console.log("Failed to connect to port" + port);
          if( nTry <= 0 ){
            console.log(err);
            reject(err);
          }
          con.destroy();
          setTimeout(test,timeout);
        });

        con.on("connect",function(){
          console.log("Connected to port" + port);
          listen = port;
          con.destroy();
          resolve(listen);
        });
      }
    }
  });
};
