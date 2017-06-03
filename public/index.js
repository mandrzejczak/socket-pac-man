var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var state = {
  clients: [],
  board: {},
};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

class User {
  constructor(id, type) {
    this.id = id;
    this.active = true;
    this.type = type;
    this.position = {
      x: 0,
      y: 0,
    };
  }

  getId() {
    return this.id;
  }

  moveLeft() {
    this.position.x--;
  }

  moveRight() {
    this.position.x++;
  }

  moveUp() {
    this.position.y--;
  }

  moveDown() {
    this.position.y++;
  }

}

io.on('connection', function(socket){
  console.log('a user connected', socket.id);

  let type = "pacman";
  if (state.clients.filter(i => i.type === 'pacman').length) {
    type = 'sprite';
  }

  const user = new User(socket.id, type);
  state.clients.push(user);
  io.emit('update', state);

  socket.on('disconnect', function(){
    console.log('user disconnected', socket.id);

    state.clients = Object.assign([],
      state.clients.filter((i) => {
        return i.getId() !== socket.id
      })
    );

    io.emit('update', state);
  });

  socket.on('update', function(msg) {
    console.log('message: ' + msg);
    io.emit('update', msg);
  });

  socket.on('up', function(msg) {
    console.log('up');

    user.moveUp();
    io.emit('update', state);
  });

  socket.on('down', function(msg) {
    console.log('down');

    user.moveDown();
    io.emit('update', state);
  });

  socket.on('left', function(msg) {
    console.log('left');

    user.moveLeft();
    io.emit('update', state);
  });

  socket.on('right', function(msg) {
    console.log('right');

    user.moveRight();
    io.emit('update', state);
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
