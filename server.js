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

app.get('/Home', function(req, res){
    res.sendFile(__dirname + '/default.html');
});

app.get('/Model', function(req, res){
   res.sendFile(__dirname + '/model.html'); 
});

app.post('/Model', function(req, res){
    console.log("Received POST to /model");
    res.status(200).end();
});

// Setup routes

// Init server loop
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server now listening at http://%s:%s', host, port);
});