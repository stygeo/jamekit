define(function() {
  var Socket = function(to) {
    if(to == undefined) {to = '//localhost';}
    var socket = io.connect(to);
    this.socket = socket;

    return this;
  };
  Socket.prototype.on = function(ev, cb, fn) {
    this.socket.on(ev, cb)
  };
  Socket.prototype.emit = function(ev, dat, fn) {
    this.socket.emit(ev, dat, fn);
  };

  Socket.sharedSocket = function() {
    if(this._sharedObject == undefined) {
      this._sharedObject = new Socket('//localhost');
    };

    return this._sharedObject;
  };

  return {Socket: Socket};
});
