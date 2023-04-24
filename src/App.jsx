import React, { Component } from 'react';
import classes from './App.module.css';
import Circle from './components/Circles/Circle';
import GameOver from './components/GameOver/GameOver';
import gameEnd from "./sounds/gameEnd.wav"
import gameStart from "./sounds/gameStart.wav"
import clickBtn from "./sounds/click.wav"

class App extends Component {
  state = {
    startGame: true,
    finishGame: false,
    score: 0,
    circles: [1, 2, 3, 4],
    activeNumber: Math.floor(Math.random() * 4) + 1,
    clicked: false,
    wrongCircle: null,
    wrongCircleCount: 0,
    audioEnd: new Audio(gameEnd),
    audioStart: new Audio(gameStart),
    audioClick: new Audio(clickBtn)
  }

  // Initialize state to default values
  initializeState = () => {
    this.setState({
      startGame: true,
      score: 0,
      circles: [1, 2, 3, 4],
      activeNumber: Math.floor(Math.random() * 4) + 1,
      clicked: false,
      wrongCircle: null,
      wrongCircleCount: 0,
      audioEnd: new Audio(gameEnd),
      audioStart: new Audio(gameStart),
      audioClick: new Audio(clickBtn)

    });
  }

  componentDidMount() {
    this.initializeState();
  }

  handleStartButton = (e) => {
    e.preventDefault();
    this.setState({startGame: !this.state.startGame});
    if(this.state.startGame) {
      this.state.audioStart.play();
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
    this.state.audioClick.play();
    if(this.state.activeNumber === circle) {
      !this.state.clicked && this.setState({score: this.state.score + 1, clicked: true})
    } else if((this.state.activeNumber !== circle)) {
      this.setState({wrongCircle: circle});
      this.setState({wrongCircleCount: this.state.wrongCircleCount + 1, clicked: true});
      if (this.state.wrongCircleCount >=2) {
        this.handleStopGame()
      }
    }
  }

  getRndInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  randomNumber = () => {
    this.setState({wrongCircle: null}); 
    let nextActive;
    do {
      nextActive = this.getRndInt(1, this.state.circles.length);
    } while (nextActive === this.state.activeNumber);
    this.setState({activeNumber: nextActive}, () => {
    });
    this.changingActiveCircle();
  };

  changingActiveCircle = () => {
    this.setState({clicked: false});
  }

  handleStopGame = () => {
    this.setState({finishGame: true})
    this.state.audioEnd.play();
    clearInterval(this.interval);
  }

  handleCloseOverlay = () => {
    this.setState({finishGame: false})
    this.initializeState();
  }
  
  render() {
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
                wrongCircle={circle === this.state.wrongCircle}
                handleCircle={() => this.handleCircle(circle)} 
                clicked={this.state.clicked}
              />)}
            </div>
            {
              (this.state.startGame) ? <button className={classes.button_start} onClick={this.handleStartButton}>Start</button>
              : <button className={classes.button_start} onClick={this.handleStartButton}>End</button>
            }
            {
              this.state.finishGame && <GameOver score={this.state.score} gameOver={this.state.finishGame} handleCloseOverlay={this.handleCloseOverlay}/>
            }
            
        </div>
      </div>
    );
  }
}

export default App;
