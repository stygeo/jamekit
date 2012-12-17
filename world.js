var guid = require('./util').Util.guid;

// Object pool
var World = function(net) {
  this.objects = {};
  this.net = net

  var self = this;
  this.net.on('sync', function() {
    var objects = []
    for(prop in self.objects) {
      objects = objects.concat(self.objects[prop]);
    }

    self.net.broadcast('world.sync', objects);
  });

  this.net.on('disconnect', function(data) {
    var socket = data.socket;

    try {
      delete self.objects[socket.id];
    } catch(e) {
    }
  });
};

World.prototype.spawnObject = function(options) {
  return {guid: guid(), position: {x: 0, y: 0}};
};

World.prototype.addObject = function(id, object) {
  if(!this.objects[id]) {this.objects[id] = [];}

  this.objects[id].push(object);
};

World.sharedWorld = function(net) {
  if(!this._sharedObject) {
    this._sharedObject = new World(net);
  }

  return this._sharedObject;
};

exports.World = World;
