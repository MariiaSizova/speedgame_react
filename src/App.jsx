import React, { Component } from 'react';
import classes from './App.module.css';
import Circle from './components/Circles/Circle';

class App extends Component {
  state = {
    startGame: true,
    score: 0,
    circles: [1, 2, 3, 4],
    activeNumber: 0
  }

  handleStartButton = (e) => {
    e.preventDefault();
    this.setState({startGame: !this.state.startGame});
    if(this.state.startGame) {
      this.handleStartGame();
    }
  }

  handleStartGame = () => {
    if(this.state.startGame) {
      setTimeout(this.randomNumber(), 1000);
    }
  }

  handleCircle = (circle) => {
    console.log("active number is", this.state.activeNumber)
    if(this.state.activeNumber === circle) {
      this.setState({score: this.state.score + 1})
      console.log(this.state.score);
      console.log("button was clicked", circle)
      console.log("active number is", this.state.activeNumber)
    }
    else {
      console.log("they are different")
    }
    
  }

  getRndInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  randomNumber = () => {
    const nextActive = this.getRndInt(0, this.state.circles.length-1);
    if (nextActive !== this.state.activeNumber) {
      this.setState({activeNumber: nextActive});
      /* this.changingButton(); */
    }
    else {
      console.log("else")
      console.log(this.state.activeNumber, "active")
      this.randomNumber();
    }
    
  };

  changingButton = () => {
    console.log("checking changing button function")
    console.log(this.state.activeNumber)
  }
  
  render() {
    return (
      <div className={classes.gamePage}>
        <div className={classes.gameCard}>
          <h1 className={classes.gameName}>Speed Game</h1>
          <h2>Score {this.state.score}</h2>
            <div className={classes.buttonsCircle}>
              {this.state.circles.map((circle) => <Circle handleCircle={() => this.handleCircle(circle)} key={circle}/>)}

            </div>
            {
              (this.state.startGame) ? <button className={classes.button_start} onClick={this.handleStartButton}>Start</button>
              : <button className={classes.button_start} onClick={this.handleStartButton}>End</button>
            }
        </div>
      </div>
    );
  }
}

export default App;
