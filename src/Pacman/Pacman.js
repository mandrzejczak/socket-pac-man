import React, { Component } from 'react';
import './Pacman.css';


export default class Board extends Component {
    constructor(props) {
        super(props);


    }

    render() {
        return (
            <div className="pacman" style={{ top: this.props.position.y, left: this.props.position.x }}>
            </div>
        );
    }
}
