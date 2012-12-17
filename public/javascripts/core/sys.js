define(function() {
  var sys = {}
  sys.inherits = function (ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false
      }
    });
  };

  sys.inArray = function(array, val) {
    for(var i=0;i<array.length;i++) {
      if(array[i] === val) {
        return true;
      }
    }
    return false;
  };

  return sys;
});
