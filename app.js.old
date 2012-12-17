var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var server = require('http').createServer(app);
var io  = require('socket.io').listen(server);
server.listen(8080);

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var sockets = [];
var characters = {};

function emit(ev, cb) {
  for(i in sockets) {
    sockets[i].emit(ev, cb);
  }
}


io.sockets.on('connection', function(socket) {
  var character;
  sockets.push(socket);
  socket.on('broadcast', function(data) {
    for(i in sockets) {
      sockets[i].emit('msg', data);
    }
  });

  socket.on('init', function(data) {
    console.log("Connected: "+data.id);
    character = data;
    characters[data.id] = data;

    for(c in characters) {
      emit('newCharacter', characters[c]);
    }
  });

  socket.on('move', function(character) {
    characters[character.id] = character;
    emit('updateCharacter', character);
  });

  socket.on('disconnect', function() {
    console.log("Disconnected: "+character.id);
    delete characters[character.id];
    emit('removeCharacter', character.id);
  });
});
