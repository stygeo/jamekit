define(['./sys', './events', './network'], function(sys, events, net) {
  var socket = net.Socket.sharedSocket();

  var BasicObject = function(options) {
    events.EventEmitter.call(this);
    this.guid = options.guid;

    if(this.guid) {
      //console.log("Object with guid : ", this.guid);
    } else {
      var self = this;
      socket.emit('object.create', {}, function(data) {
        self.guid = data.guid;

        // Emit a verify message to those interested (guid set)
        self.emit('verified');
      });
    }
  };
  sys.inherits(BasicObject, events.EventEmitter);


  return BasicObject;
});
