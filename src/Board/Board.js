import React, { Component } from 'react';
import Hero from '../Hero/Hero'
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
            },
            spritePosition: {
                x: 100,
                y: 400
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
    };

    render() {
        return (
            <div className="board" style={{ width: boardDimensions.x, height: boardDimensions.y }}>

                <Hero character="pacman" position={ this.state.pacmanPosition } />
                <Hero character="sprite" position={ this.state.spritePosition } />
            </div>
        );
    }
}
