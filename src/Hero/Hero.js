import React, { Component } from 'react';
import './Hero.css';


export default class Hero extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={ 'hero -' +  this.props.character } style={{ top: this.props.position.y, left: this.props.position.x }}>
            </div>
        );
    }
}
