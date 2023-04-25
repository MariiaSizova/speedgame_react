import React, { Component } from 'react';
import classes from './App.module.css';
import Circle from './components/Circles/Circle';
import GameOver from './components/GameOver/GameOver';
import gameEnd from "./sounds/gameEnd.wav"
import gameStart from "./sounds/gameStart.wav"
import clickBtn from "./sounds/click.wav"

class App extends Component {
  state = {
    welcomePage: true,
    startGame: true,
    finishGame: false,
    score: 0,
    level: "",
    name: "",
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
      welcomePage: true,
      startGame: true,
      score: 0,
      level: "",
      userName: "",
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
      finalText: "",
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
      this.handleLevelGame();
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
    this.setState({countClicks: this.state.countClicks + 1});
    this.state.audioClick.play();
    
    if(this.state.activeNumber === circle) {
      !this.state.clicked && this.setState({score: this.state.score + 1, clicked: true});
    } else if((this.state.activeNumber !== circle)) {
      this.setState({wrongCircle: circle});
      this.setState({wrongCircleCount: this.state.wrongCircleCount + 1, clicked: true});
      if (this.state.wrongCircleCount >=2) {
        this.handleStopGame();
      }
    }
  }

  getRndInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  randomNumber = () => {
    const missedRounds = (this.state.countRounds - this.state.countClicks);
    if(missedRounds <= 3){
      this.setState({countRounds: this.state.countRounds+1});
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
      this.handleStopGame();
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
    console.log(this.state.level === "Hard");
    if (this.state.level === "Easy") {
      this.setState({finalText: "Try again!"})
    }
    else if(this.state.level === "Medium") {
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 2500);
      this.setState({finalText: "You need to learn A LOT how to catch up with bugs!"});
    }
    else if(this.state.level === "Hard") {
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 2000);
      this.setState({finalText: "You need to learn a little bit how to catch up with bugs!"});
    }
    else if(this.state.level === "Professional") {
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 1000);
      this.setState({finalText: "Wow... A few lessons more and you will be perfect!"});
    }
/*     else if(score >=30 && score < 50) {
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 800);
      this.setState({finalText: "Where did you train this? Nice job!"});
    }
    else if(score >=50) {
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 500);
      this.setState({finalText: "You are a master! Perfect!"});
    } */
  };

  handleStopGame = () => {
    this.setState({finishGame: true});
    this.state.audioEnd.play();
    clearInterval(this.interval);
  }

  handleCloseOverlay = () => {
    this.setState({finishGame: false});
    this.initializeState();
  }

  //firstPage

  handleNameChange = (e) => {
    this.setState({name: e.target.value});
    console.log(e.target.value)
  }

  handleLevelChange = (e) => {
    this.setState({level: e.target.value});
    console.log(e.target.value)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({welcomePage: false})
  }

  render() {
    return (
      <div className={classes.gamePage}>
        <div className={classes.gameCard}>
          <h1 className={classes.gameName}>Speed Game</h1>
          <div className={classes.lives}>
            <span className={`material-symbols-outlined ${classes.bug_1} ${this.state.wrongCircleCount>=3 ? classes.bug_1_lose  : ""}`}> bug_report </span>
            <span className={`material-symbols-outlined ${classes.bug_2} ${this.state.wrongCircleCount>=2 ? classes.bug_2_lose  : ""}`}> bug_report </span>
            <span className={`material-symbols-outlined ${classes.bug_3} ${this.state.wrongCircleCount>=1 && classes.bug_3_lose}`}> bug_report </span>
          </div>
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
        <div className={`${classes.gameCard} ${classes.inputPage} ${!this.state.welcomePage && classes.closeWelcome}`}>
          <h1 className={classes.welcome}>Welcome to Speed Game</h1>
          <form>
            <div className={classes.nameInput}>
              <label htmlFor="username">Nickname</label>
              <input type="text" id="username" name="username" value={this.state.name} onChange={this.handleNameChange}/>
            </div>
            <div className={classes.levelInput}>
              <label htmlFor="level">Choose a level</label>
              <select name="level" id="level" value={this.state.level} onChange={this.handleLevelChange}>
                <option value="" invalid="true" hidden>Choose a level...</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
            <button className={`${classes.btn}`} onClick={this.handleSubmit}>Submit</button>
          </form>
        </div>
      </div>

    );
  }
}
export default App;
