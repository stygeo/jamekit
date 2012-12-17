define(['core/network', 'core/objects', 'core/world', 'core/sys'], function(net, objects, World, sys) {
  var core = {};
  var JameKit = {net: net};
  var Sprite = objects.Sprite;
  var Socket = net.Socket;

  JameKit.init = function(cb) {
    var socket = Socket.sharedSocket();
    this.socket = socket;

    var world = World.sharedWorld();
    this.world = world;

    var obj = new Sprite({image: 'images/char.gif'});
    var x = Math.round(Math.random() * 100)
      , y = Math.round(Math.random() * 100)
      , p = obj.position;

    obj.position = new cc.Point(p.x + x, p.y + y);

    world.on('world.add.object', function(data){socket.emit("world.add.object", {object: data.object.serialize()});});

    world.addObject(obj);

    cb.call(this);
  };

  core.JameKit = JameKit;

  return core;
});
