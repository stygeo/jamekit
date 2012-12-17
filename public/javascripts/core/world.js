define(['./sys', './events', './network', './objects'], function(sys, events, net, objects) {
  var socket = net.Socket.sharedSocket();
  var Sprite = objects.Sprite;

  var World = function() {
    if(World._sharedObject) {throw "There can only be one Wold Object. Use World.sharedWorld";}

    // Call EventEmitters constructor
    events.EventEmitter.call(this);

    this.sections = [];
    this.objects = {};

    var director = cc.Director.sharedDirector;
    director.attachInView(document.getElementById("canvas"));
    director.displayFPS = true;

    var scene = new cc.Scene;
    var layer = new cc.Layer;
    scene.addChild(layer);

    director.runWithScene(scene);

    this.scene = scene;
    this.layer = layer;

    var self = this;
    socket.on('world.sync', function(data) {self.sync(data);});
  };
  sys.inherits(World, events.EventEmitter);

  // Add object to the world.
  World.prototype.addObject = function(object) {
    // If for whatever reason the guid isn't set yet (server response is slow) wait for a guid set and add the object.
    if(object.guid) {
        this.emit("world.add.object", {object: object});

        this.addLocal(object);
    } else {
      var self = this;
      object.on('verified', function() {
        self.emit("world.add.object", {object: object});

        self.addLocal(object);
      });
    }

  };

  World.prototype.addLocal = function(object) {
    this.emit("world.add.local", {object: object});
    this.objects[object.guid] = object;

    // Add the sprite object to cocos.
    this.layer.addChild(object._sprite);
  };

  // Remove object from the world.
  World.prototype.removeObject = function(object_or_object_id) {
    // Type check for object.
    var object = (typeof(object_or_object_id) == "object" ? object_or_object_id : this.objects[object_or_object_id]);
    // Emit message.
    this.emit("world.remove.object", {object: object});

    // Remove the sprite from the scene.
    this.layer.removeChild(object._sprite);
  };

  World.prototype.sync = function(objects) {
    // Ids for sorting out the cleanup.
    var ids = [];
    for(object in objects) {
      this.syncObject(objects[object]);

      ids.push(objects[object].guid); // Push existing id
    }

    // Clean up
    this.cleanUp(ids);
  };

  World.prototype.syncObject = function(object) {
    // Existing object
    if(this.objects[object.guid]) {
      object.position = cc.Point(object.position.x, object.position.y);
    } else if(object.guid) { // New object
      var o = new Sprite({guid: object.guid, image: object.sprite.image});
      o.position = new cc.Point(object.position.x, object.position.y);

      // Add to local (don't addObject, that fires network events)
      this.addLocal(o);
    }
  };

  World.prototype.cleanUp = function(existingIds) {
    for(var guid in this.objects) {
      var object = this.objects[guid];
      if(!sys.inArray(existingIds, guid)) {
        this.removeObject(object);
      }
    }
  };

  World.sharedWorld = function() {
    if(this._sharedObject == undefined) {
      this._sharedObject = new World();
    };

    return this._sharedObject;
  };

  return World;
});
