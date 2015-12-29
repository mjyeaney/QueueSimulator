//
// Main node entry point. This file will be automatically
// bootstrapped by the Azure runtime.
//

// Pull in libs and bootstrap env
var express = require('express')
var app = express();

// Check for the PORT env var from the azure host
var port = process.env.PORT || 8008;

// Enable basic static resource support
app.use(express.static(__dirname, {
    index : 'default.html'
}));

// Setup routes

// Init server loop
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server now listening at http://%s:%s', host, port);
});