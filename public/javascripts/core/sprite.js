define(['./sys', './basic_object'], function(sys, BasicObject) {
  var Sprite = function(options) {
    if(!options) {options={};}

    BasicObject.call(this, options);

    var director = cc.Director.sharedDirector;
    var size = director.winSize;
    this._sprite = new cc.Sprite({url: options.image});
    this.image = options.image;

    Object.defineProperty(this, 'position', {
      get: function()      {return this._sprite.position;},
      set: function(point) {this._sprite.position = point;}
    });

    this.position = new cc.Point((size.width / 2), (size.height / 2));

    return this;
  };
  sys.inherits(Sprite, BasicObject);

  Sprite.prototype.serialize = function() {
    return {
      guid: this.guid,
      position: {
        x: this.position.x,
        y: this.position.y
      },
      sprite: {
        image: this.image,
      }
    };
  };

  return Sprite;
});
