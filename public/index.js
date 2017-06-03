var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
    this.actualDirection = null;
    this.nextDirection = null;
  }

  getId() {
    return this.id;
  }

  changeDirection(dir) {
    this.nextDirection = dir;
  }
}

class Game {
  constructor() {
    this.state = {
      clients: [],
      board: {
        width: 100,
        height: 100,
        tileSize: 50,
      },
      walls: [
        {
          x: 50,
          y: 0,
        },
        {
          x: 0,
          y: 50,
        }
      ]
    };

    io.on('connection', socket => {
      console.log('a user connected', socket.id);

      let type = "pacman";
      if (this.state.clients.filter(i => i.type === 'pacman').length) {
        type = 'sprite';
      }

      const user = new User(socket.id, type);
      this.state.clients.push(user);
      io.emit('update', this.state);

      socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);

        this.state.clients = Object.assign([],
          this.state.clients.filter((i) => {
            return i.getId() !== socket.id
          })
        );

        io.emit('update', this.state);
      });

      socket.on('up', (msg) => {
        console.log('up');

        user.changeDirection('up');
      });

      socket.on('down', (msg) => {
        console.log('down');

        user.changeDirection('down');
      });

      socket.on('left', (msg) => {
        console.log('left');

        user.changeDirection('left');
      });

      socket.on('right', (msg) => {
        console.log('right');

        user.changeDirection('right');
      });
    });

    setInterval(this.updateGame.bind(this), 45);
  }

  checkWallCollision(dir, pos) {
    if (dir === 'right') {
      return this.state.walls.filter(i => pos.x + this.state.board.tileSize + 1 === i.x).length;
    }

    if (dir === 'left') {
      return this.state.walls.filter(i => pos.x - 1 === i.x + this.state.board.tileSize).length;
    }

    if (dir === 'down') {
      return this.state.walls.filter(i => pos.y + this.state.board.tileSize + 1 === i.y).length;
    }

    if (dir === 'up') {
      return this.state.walls.filter(i => pos.y - 1 === i.y + this.state.board.tileSize).length;
    }

    return false;
  }

  updateGame() {
    this.state.clients.forEach(i => {
      if (this.checkWallCollision(i.actualDirection, i.position)) {
        console.log('collision');
        i.actualDirection = null;
      } else {
        if (i.nextDirection) {
          i.actualDirection = i.nextDirection;
          i.nextDirection = null;
        }
      }


      if (i.actualDirection) {
        if (i.actualDirection === 'up') {
          i.position.y--;
        }

        if (i.actualDirection === 'down') {
          i.position.y++;
        }

        if (i.actualDirection === 'left') {
          i.position.x--;
        }

        if (i.actualDirection === 'right') {
          i.position.x++;
        }
      }

      io.emit('update', this.state);
    })
  }
}

new Game();

http.listen(3001, () => {
  console.log('listening on *:3001');
});
