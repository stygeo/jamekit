
var web = require('./web')
  , express = require('express')
  , app = web.app
  , server = web.server
  , routes = require('./routes')
  , user = require('./routes/user')
  , path = require('path');

var Network = require('./socket').Network;
var net = Network.sharedNetwork();

net.on('connect', function(data) {
  console.log("connection test");
});

// This is the actual main loop
var mId = setInterval(function() {
  net.sync();
}, 500);
