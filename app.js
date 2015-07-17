
/*

   node js app to server R shiny app through a proxy

*/

var https = require('https'),
    http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs');



settings = './settings/settings.js'
settingsAlt = './settings/example.settings.js'


var port = "",
    portOk = false,
    path = "inst/example",
    portTestCounter = 10,
    portTestDelay = 1000,
    launchAppCounter = 10,
    launchAppDelay = 1000,
    children = [];

fs.access(settings, fs.R_OK, function(err) {
  with (global) {
    if(err){
      console.log('Settings file not found, take alternative file' + settingsAlt)
      eval(fs.readFileSync(settingsAlt) + '');
    }else{
      console.log('Load settings');
      eval(fs.readFileSync(settings) + '');
      console.log(path);
    };
  };
});



var mxSpawn = require('child_process').spawn,
     mxExec = require('child_process').exec;

//
// FUNCTIONS
//

// Kill unstopped children process when the app exit.
process.on('exit', function() {
  console.log('Process exit. Killing', children.length, 'child processes');
  children.forEach(function(child) {
    console.log('* Kill process PID: ' + child.pid);
    child.kill();
  });
});

// Connection test to port of shiny app; stdout to null; evaluate success or fail of the last command (echo $?); run proxy if ok.
var portTest = function(){
  testPort = 'nc -z localhost ' + parseInt(port) + ' &>/dev/null; echo $?';
  child = mxExec(testPort, function(err, stdout, stderr) {
    if (err){ 
      throw err 
    } else { 
      portOk = parseInt(stdout) == parseInt(0);
      port = parseInt(port);
      console.log('Port '+ port +' is reachable: ' + portOk);
      portTestCounter--;
      if(portOk && portTestCounter > 0 ){ 
        console.log('Port ' + port + ' is responding, connect to proxy.');
        setProxyWebSocket(port,'localhost');
      }else{ 
        console.log('Port '+ port +' is not yet reachable. Waiting.');
        setTimeout(portTest, portTestDelay);    
      }
    };
  });
};

// Setup our server to proxy standard HTTP requests 
var  setProxyWebSocket = function(port,host){

  // set options for https from this script
  /*
  var options = {
  key: fs.readFileSync('settings/ssl/key.pem', 'utf8'),
  cert: fs.readFileSync('settings/ssl/key-cert.pem', 'utf8')
  };

*/

  // Create proxy to process
  var proxy = new httpProxy.createProxyServer({
    target: {
      host: 'localhost',
      port: port
    }
  });

  // If ssl sould be enabled at the proxy level
  /*
  var proxyServer = https.createServer(options,function (req, res) {
    proxy.web(req, res);
   });
  */
  var proxyServer = http.createServer(function (req, res) {
    proxy.web(req, res);
  });

  // error
  proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Something went wrong in the proxy.');
    throw err;
  });

  // websocked upgrade
  proxyServer.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

  // close
  proxyServer.on('close', function (req, socket, head) {
    console.log('Client disconnected');
  });
 
proxyServer.listen(portOut);

};

// Application launcher. Main function.
launchShinyApp = function(){

  console.log('---------------- Start launch shiny app ---------------');
  console.log('Find the next open port...');

  getPort = "python -c 'import socket; s=socket.socket(); s.bind((\"\", 0)); print(s.getsockname()[1]); s.close()'" ;

  child = mxExec(getPort, function(err, stdout, stderr){
    if(err){
      throw err
    }else{
      port = parseInt(stdout);
      console.log('Run shiny app in folder "' + path + '" on port' + parseInt(port));
      // spawn child process
      R  = mxSpawn('Rscript', ['utils/runApp.R',port,path]);
      // register child 
      children.push(R);
      // get cmd stdout
      R.stdout.on('data', function(data) {
        out = data.toString();
        console.log('R: '+ out);
      });
      // get cmd stderr
      R.stderr.on('data', function(data){
        err = data.toString();
        console.log('R: ' + err);
      });

      R.on('exit',function(code){
        if(code==1){  
          console.log('R exit code: '+code)
        }else{
          console.log('R exit code: '+code)
            process.kill();
        }
      });

      // print pid
      console.log('Pid for R process: ' + R.pid);
      // check if the port is reachable
      portTest();
      R.stdin.end();
    }
  });
};


// Launch app if the path is directory.
// TODO: Add more verifications : contains server.R AND ui.R OR app.R.
fs.access(path, fs.R_OK, function(err) {
  if(err){
    console.log('Path to R app error (no read permission for path " ' + path + '")');
    return null;
  }else{
    launchShinyApp();  
  };
});










