/*

   node js app to server R shiny app through a proxy

   */

var http = require('http'),
    httpProxy = require('http-proxy');


  //
  // SERVER PROXY
  // 

  // Setup our server to proxy standard HTTP requests 



var  setProxyWebSocket = function(port,host,listen){
  var proxy = new httpProxy.createProxyServer({
    target: {
      host: 'localhost',
      port: port
    }
  });
  var proxyServer = http.createServer(function (req, res) {
    proxy.web(req, res);
  });



  proxyServer.on('error', function (err, req, res) {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });

    res.end('Something went wrong. And we are reporting a custom error message.');
  });

  // 
  // Listen to the `upgrade` event and proxy the 
  // WebSocket requests as well. 
  // 
  proxyServer.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });


  proxyServer.on('close', function (req, socket, head) {
    // view disconnected websocket connections
    console.log('Client disconnected');
  });



  proxyServer.listen(3000);
}



var port = ""
var portOk = false
var portTestCounter = 10
var portTestDelay = 500

var mxProcess = require('child_process').spawn;

console.log('Wait for next open port');

var mxGetPort = mxProcess('sh',['utils/findNextOpenPort.sh']);


// get
mxGetPort.stdout.on('data',function(data){
  port = data.toString();
  // print which port will be used 
  console.log('port open found: ' + port);

  //
  // SPAWN SHINY APP
  // 

  mxRunShiny  = mxProcess('Rscript', ['utils/runApp.R',port]);
  // get cmd stdout
  mxRunShiny.stdout.on('data', function(data) {
    console.log(data.toString());
  });
  mxRunShiny.stderr.on('data', function(data){
    console.log(data.toString());
  });
  // print pid
  console.log('mxRunShiny pid: ' + mxRunShiny.pid);



  //
  // TEST IF PORT RESPONDING AND CONNECT PROXY
  //

  portTest = function(){
    mxTestPort = mxProcess('sh',['utils/testIfPortIsReady.sh',port]);
    mxTestPort.stdout.on('data',function(data){
      portOk = data.toString() == 0;
    });
    console.log('Port '+port+' state is ',portOk);
    portTestCounter--;
    if (portTestCounter > 0 && !portOk) {
      console.log('Port connection test number', portTestCounter)
        setTimeout(portTest, portTestDelay);    
    }else if(portOk){ 
      console.log('Connect proxy')
      setProxyWebSocket(port,'localhost',3000);
    }; 
  };

  portTest();


  mxRunShiny.stdin.end();

});

mxGetPort.stdin.end();
