import React, { Component } from 'react';
import Pacman from '../Pacman/Pacman'
import './Board.css';


const boardDimensions = {
    x: 800,
    y: 500
};


const positionOffset = 50;


export default class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pacmanPosition: {
                x: 300,
                y: 200
            }
        };
        document.addEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress = (event) => {


        switch(event.key) {
            case 'ArrowUp':
                this.setState((prevState) => {
                    return {
                        pacmanPosition: {
                            ...prevState.pacmanPosition,
                            y: prevState.pacmanPosition.y - positionOffset,
                        },
                    }
                });
                break;
            case 'ArrowRight':
                this.setState((prevState) => {
                    return {
                        pacmanPosition: {
                            ...prevState.pacmanPosition,
                            x: prevState.pacmanPosition.x + positionOffset,
                        },
                    }
                });
                break;
            case 'ArrowDown':
                this.setState((prevState) => {
                    return {
                        pacmanPosition: {
                            ...prevState.pacmanPosition,
                            y: prevState.pacmanPosition.y + positionOffset,
                        },
                    }
                });
                break;
            case 'ArrowLeft':
                this.setState((prevState) => {
                    return {
                        pacmanPosition: {
                            ...prevState.pacmanPosition,
                            x: prevState.pacmanPosition.x - positionOffset,
                        },
                    }
                });
                break;
        }

        console.log(this.state.pacmanPosition.y)
    };

    render() {
        return (
            <div className="board" style={{ width: boardDimensions.x, height: boardDimensions.y }}>

                <Pacman position={ this.state.pacmanPosition }></Pacman>
            </div>
        );
    }
}
