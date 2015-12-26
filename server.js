// Main node entry point. This file will be automatically
// bootstrapped by the Azure runtime.

// For now just manually bind to a socket.
var http = require('http')
var port = process.env.PORT || 1337;

http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port);