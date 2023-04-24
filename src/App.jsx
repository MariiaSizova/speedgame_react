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
    countRounds: 0,
    countClicks: 0,
    circles: [1, 2, 3],
    activeNumber: Math.floor(Math.random() * 4) + 1,
    clicked: false,
    wrongCircle: null,
    wrongCircleCount: 0,
    audioEnd: new Audio(gameEnd),
    audioStart: new Audio(gameStart),
    audioClick: new Audio(clickBtn),
    finalText: ""
  }

  // Initialize state to default values
  initializeState = () => {
    this.setState({
      startGame: true,
      score: 0,
      countRounds: 0,
      countClicks: 0,
      circles: [1, 2, 3],
      activeNumber: Math.floor(Math.random() * 4) + 1,
      clicked: false,
      wrongCircle: null,
      wrongCircleCount: 0,
      audioEnd: new Audio(gameEnd),
      audioStart: new Audio(gameStart),
      audioClick: new Audio(clickBtn),
      finalText: ""
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
      this.interval = setInterval(this.randomNumber, 3000);
    }
  }

  handleCircle = (circle) => {
    this.setState({countClicks: this.state.countClicks + 1})
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
    const missedRounds = (this.state.countRounds - this.state.countClicks);
    if(missedRounds <= 3){
      this.setState({countRounds: this.state.countRounds+1})
      this.handleLevelGame();
      this.setState({wrongCircle: null}); 
      let nextActive;
      do {
        nextActive = this.getRndInt(1, this.state.circles.length);
      } while (nextActive === this.state.activeNumber);
      this.setState({activeNumber: nextActive}, () => {
      });
      this.changingActiveCircle();
    } else {
      this.handleStopGame()
    }
  };

  changingActiveCircle = () => {
    this.setState({clicked: false});
  }

  handleLevelGame = () => {
    let score = this.state.score;
    if(score === 10) {
      this.setState(previousState => ({
        circles: [...previousState.circles, 4]
      }));
    }
    if (score < 4) {
      this.setState({finalText: "Try again!"})
    }
    else if(score >=4 && score < 8) {
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 2500);
      this.setState({finalText: "You need to learn A LOT how to catch up with bugs!"})
    }
    else if(score >=8 && score < 15) {
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 2000);
      this.setState({finalText: "You need to learn a little bit how to catch up with bugs!"})
    }
    else if(score >=15 && score < 30) {
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 1000);
      this.setState({finalText: "Wow... A few lessons more and you will be perfect!"})
    }
    else if(score >=30 && score < 50) {
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 800);
      this.setState({finalText: "Where did you train this? Nice job!"})
    }
    else if(score >=50) {
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 500);
      this.setState({finalText: "You are a master! Perfect!"})
    }
  };

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
              this.state.finishGame && <GameOver score={this.state.score} gameOver={this.state.finishGame} handleCloseOverlay={this.handleCloseOverlay} finalText={this.state.finalText}/>
            }
            
        </div>
      </div>
    );
  }
}

export default App;
