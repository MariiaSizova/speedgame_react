import React, { Component } from 'react';
import classes from './App.module.css';
import Circle from './components/Circles/Circle';

class App extends Component {
  state = {
    startGame: true,
    score: 0,
    circles: [1, 2, 3, 4],
    activeNumber: 1,
    buttons: []
  }

  // Initialize state to default values
  initializeState = () => {
    this.setState({
      startGame: true,
      score: 0,
      circles: [1, 2, 3, 4],
      activeNumber: 1
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
      console.log(this.state.startGame)
      this.interval = setInterval(this.randomNumber, 4000);
    }
  }

  handleCircle = (circle) => {
    if(this.state.activeNumber === circle) {
      this.setState({score: this.state.score + 1})
      console.log("button was clicked", circle)
      console.log("active number is", this.state.activeNumber)
    }
    else {
      console.log("button was clicked", circle)
      console.log("they are different")
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
    const buttons = this.state.circles.map(id => ({ id, className: 'disabled' }));
    /*this.setState({buttons: buttons});
    let active = this.state.activeNumber; 
    console.log(buttons); */
    const buttonss = this.state.buttons.map(button => {
      if (button.id === this.state.activeNumber) {
        return { ...button, className: 'able' };
      } else {
        return { ...button, className: 'disabled' };
      }
    });
    console.log(buttonss);
  
    this.setState({ buttons: buttons}, () => {
      console.log(this.state.buttons, "buttons")});
  }

  handleStopGame = () => {
    console.log('game over');
    clearInterval(this.interval);
    this.initializeState();
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
