var EventEmitter = require('events').EventEmitter
  , util = require('util')
  , server = require('./web').server
  , sio = require('socket.io')
  , guid = require('./util').Util.guid;

var World = require('./world').World

var Network = function(io) {
  if(io == undefined) {io = sio.listen(server);}

  EventEmitter.call(this);
  this.io = io;
  this.sockets = {};

  var network = this;

  var world = World.sharedWorld(this);

  // Defaults
  io.sockets.on('connection', function(socket) {
    console.log("Connection");
    network.sockets[socket.id] = socket;
    network.emit('connect', {socket: socket});
    socket.on('disconnect', function() {
      network.emit('disconnect', {socket: socket});
      try {
        delete this.sockets[socket.id];
      } catch(e) {
        console.log(e);
      }
    });

    socket.on('object.create', function(data, fn) {
      console.log("object.create ", data);

      var obj = world.spawnObject(data);

      fn(obj);
    });

    socket.on('world.add.object', function(data) {
      var object = data.object;

      world.addObject(this.id, object);
    });
  });
};
util.inherits(Network, EventEmitter);

Network.sharedNetwork = function() {
  if(!this._sharedObject) {
    this._sharedObject = new Network();
  }

  return this._sharedObject;
};

Network.prototype.sync = function() {
  this.emit('sync');
};

Network.prototype.broadcast = function(event, data) {
  this.emit('broadcast', data);
  this.io.sockets.emit(event, data);
};

exports.Network = Network;
