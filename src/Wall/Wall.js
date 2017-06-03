import React, { Component } from 'react';
import './Wall.css';


export default class Wall extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                className="wall"
                style={{
                    top: this.props.position.y,
                    left: this.props.position.x,
                    width: this.props.tileSize,
                    height: this.props.tileSize
                }}>
            </div>
        );
    }
}
