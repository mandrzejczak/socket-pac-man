import React, { Component } from 'react';
import './Hero.css';


export default class Hero extends Component {
    constructor(props) {
        super(props);

        this.character = this.props.character;
    }

    render() {
        return (
            <div className={ 'hero -' +  this.character } style={{ top: this.props.position.y, left: this.props.position.x }}>
            </div>
        );
    }
}
