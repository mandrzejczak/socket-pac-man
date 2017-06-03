import React, { Component } from 'react';
import Hero from '../Hero/Hero'
import Wall from '../Wall/Wall'
import './Board.css';

import { socketConnect } from 'socket.io-react';

const boardDimensions = {
    x: 800,
    y: 500
};


const positionOffset = 50;


class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            walls: []
        };

        document.addEventListener('keydown', this.handleKeyPress);
    }

    componentDidMount() {
      this.props.socket.on('update', this.update);
    }

    update = (data) => {
      this.setState({
        players: data.clients,
        walls: data.walls,
        board: data.board
      });
    };

    handleKeyPress = (event) => {
        switch(event.key) {
            case 'ArrowUp':
              this.props.socket.emit('up');
              break;
            case 'ArrowRight':
              this.props.socket.emit('right');
              break;
            case 'ArrowDown':
              this.props.socket.emit('down');
              break;
            case 'ArrowLeft':
              this.props.socket.emit('left');
              break;
        }
    };

    render() {
        return (
            <div className="board" style={{ width: boardDimensions.x, height: boardDimensions.y }}>
              {this.state.players.map(i =>
                <Hero
                  character={i.type}
                  position={ i.position }
                  key={i.id}
                />
              )}
              {this.state.walls.map(i =>
                  <Wall
                      position={ i }
                      tileSize={this.state.board.tileSize}
                  />
                )}
            </div>
        );
    }
}

export default socketConnect(Board);
