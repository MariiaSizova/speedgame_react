import React, { Component } from 'react';
import classes from './App.module.css';
import Circle from './components/Circles/Circle';

class App extends Component {
  state = {
    startGame: true,
    score: 0,
    circles: [1, 2, 3, 4],
    activeNumber: Math.floor(Math.random() * 4) + 1,
    clicked: false,
  }

  // Initialize state to default values
  initializeState = () => {
    this.setState({
      startGame: true,
      score: 0,
      circles: [1, 2, 3, 4],
      activeNumber: Math.floor(Math.random() * 4) + 1
    });
  }

  componentDidMount() {
    this.initializeState();
  }

  handleStartButton = (e) => {
    e.preventDefault();
    this.setState({startGame: !this.state.startGame});
    if(this.state.startGame) {
      this.handleStartGame();
    }
    if(!this.state.startGame) {
      this.handleStopGame();
    }
  }

  handleStartGame = () => {
    if(this.state.startGame) {
      this.interval = setInterval(this.randomNumber, 4000);
    }
  }

  handleCircle = (circle) => {
    if(this.state.activeNumber === circle) {
      {!this.state.clicked && this.setState({score: this.state.score + 1, clicked: true})}
    }
    else {
      this.handleStopGame();
    }
  }

  getRndInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  randomNumber = () => {
    let nextActive;
    do {
      nextActive = this.getRndInt(1, this.state.circles.length);
      console.log(nextActive, 'nextActive')
    } while (nextActive === this.state.activeNumber);
    this.setState({activeNumber: nextActive}, () => {
      console.log(this.state.activeNumber, "active");
    });
    this.changingActiveCircle();
  };

  changingActiveCircle = () => {
    this.setState({clicked: false});
  }

  handleStopGame = () => {
    console.log('game over');
    clearInterval(this.interval);
    this.initializeState();
  }
  
  render() {
    //console.log(this.state.startGame)
    return (
      <div className={classes.gamePage}>
        <div className={classes.gameCard}>
          <h1 className={classes.gameName}>Speed Game</h1>
          <h2>Score {this.state.score}</h2>
            <div className={classes.buttonsCircle}>
              {this.state.circles.map((circle) => <Circle 
                key={circle}
                start={this.state.startGame}
                active={circle === this.state.activeNumber} 
                handleCircle={() => this.handleCircle(circle)} 
              />)}
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
