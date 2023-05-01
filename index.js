var express = require('express');
var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 8000);

app.use(express.static(__dirname, 'public'));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log(`Open: http://localhost:${port}`);
});