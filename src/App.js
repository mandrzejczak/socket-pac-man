import React, { Component } from 'react';
import logo from './pacman-ico.svg';
import './App.css';
import Board from './Board/Board';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Pacman</h2>
        </div>

          <Board/>


      </div>
    );
  }
}

export default App;
