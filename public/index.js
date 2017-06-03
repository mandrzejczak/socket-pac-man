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
    this.points = 0;
    this.color = "#"+((1<<24)*Math.random()|0).toString(16);
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
        width: 800,
        height: 500,
        tileSize: 50,
        move: 1,
      },
      walls: [
          {
              x: 100,
              y: 100
          },
          {
              x: 350,
              y: 100
          },
          {
              x: 150,
              y: 100
          },
          {
              x: 100,
              y: 150
          },
          {
              x: 0,
              y: 300
          },
          {
              x: 50,
              y: 300
          },
          {
              x: 100,
              y: 300
          },
          {
              x: 150,
              y: 250
          },
          {
              x: 350,
              y: 150
          },
          {
              x: 400,
              y: 200
          },
          {
              x: 350,
              y: 300
          },
          {
              x: 300,
              y: 350
          },
          {
              x: 250,
              y: 400
          },
          {
              x: 350,
              y: 450
          },
          {
              x: 400,
              y: 400
          },
          {
              x: 500,
              y: 300
          },
          {
              x: 600,
              y: 100
          },
          {
              x: 650,
              y: 100
          },
          {
              x: 650,
              y: 150
          },
          {
              x: 650,
              y: 400
          },
          {
              x: 700,
              y: 350
          },
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

      socket.on('up', () => {
        user.changeDirection('up');
      });

      socket.on('down', () => {
        user.changeDirection('down');
      });

      socket.on('left', () => {
        user.changeDirection('left');
      });

      socket.on('right', () => {
        user.changeDirection('right');
      });
    });

    setInterval(this.updateGame.bind(this), 5);
  }

  checkWallCollision(dir, _ourPos) {
    let ourPos = {x: 0, y: 0};
    if (dir === 'up') {
      ourPos.y = _ourPos.y - 1;
      ourPos.x = _ourPos.x;
    }
    if (dir === 'down') {
      ourPos.y = _ourPos.y + 1;
      ourPos.x = _ourPos.x;
    }
    if (dir === 'left') {
      ourPos.x = _ourPos.x - 1;
      ourPos.y = _ourPos.y;
    }
    if (dir === 'right') {
      ourPos.x = _ourPos.x + 1;
      ourPos.y = _ourPos.y;
    }

    if (ourPos.x < 0 || ourPos.x > this.state.board.width - this.state.board.tileSize) {
      return true;
    }

    if (ourPos.y < 0 || ourPos.y > this.state.board.height - this.state.board.tileSize) {
      return true;
    }

    return this.state.walls.filter(wall => {
      if (ourPos.x < wall.x + this.state.board.tileSize &&
        ourPos.x + this.state.board.tileSize > wall.x &&
        ourPos.y < wall.y + this.state.board.tileSize &&
        this.state.board.tileSize + ourPos.y > wall.y) {
        return true;
      } else {
        return false;
      }
    }).length;

  }

  checkPacmanCollision() {
    const pacman = this.state.clients.filter(i => i.type === 'pacman')[0];
    const ghosts = this.state.clients.filter(i => i.type !== 'pacman');

    const activeGhosts = ghosts.filter(ghost => {
      if (pacman.position.x < ghost.position.x + this.state.board.tileSize &&
        pacman.position.x + this.state.board.tileSize > ghost.position.x &&
        pacman.position.y < ghost.position.y + this.state.board.tileSize &&
        this.state.board.tileSize + pacman.position.y > ghost.position.y) {
        return true;
      } else {
        return false;
      }
    });

    activeGhosts.forEach(ghost => ghost.points++);

    return !!activeGhosts.length;
  }

  updateGame() {
    this.state.clients.forEach(i => {
      if (i.nextDirection) {
      }
      // if (!i.actualDirection && i.nextDirection) {
        i.actualDirection = i.nextDirection;
        // i.nextDirection = null;
      // }

      if (this.checkWallCollision(i.actualDirection, i.position)) {
        i.actualDirection = null;
      } else {
        if (i.actualDirection) {
          if (i.actualDirection === 'up') {
            i.position.y -= this.state.board.move;
          }

          if (i.actualDirection === 'down') {
            i.position.y += this.state.board.move;
          }

          if (i.actualDirection === 'left') {
            i.position.x -= this.state.board.move;
          }

          if (i.actualDirection === 'right') {
            i.position.x += this.state.board.move;
          }
        }
      }

      if (this.state.clients.filter(i => i.type === 'pacman').length) {
        this.checkPacmanCollision();
      }
      // this.state.clients.map(i => console.log(i.points));

      io.emit('update', this.state);
    })
  }
}

new Game();

http.listen(3001, () => {
  console.log('listening on *:3001');
});
