import React, { Component } from 'react';
import './Scoreboard.css';


export default class Scoreboard   extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="scoreboard">
                <h1>Scoreboard</h1>

                {this.props.players.map(i =>
                    <h4 className="scoreboard__player"
                    >
                        Player
                        <span className="scoreboard__player-id" style={{
                            background: i.color,
                    }}></span>:
                        {i.points} points
                    </h4>
                )}
            </div>
        );
    }
}
