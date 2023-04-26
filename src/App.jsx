import React, { Component } from 'react';
import classes from './App.module.css';
import Circle from './components/Circles/Circle';
import GameOver from './components/GameOver/GameOver';
import GameRules from './components/GameRules/GameRules';
import gameEnd from "./sounds/gameEnd.wav";
import gameStart from "./sounds/gameStart.wav";
import clickBtn from "./sounds/click.wav";

class App extends Component {
  state = {
    welcomePage: true,
    startGame: true,
    finishGame: false,
    score: 0,
    level: "",
    name: "",
    countRounds: 0,
    timer: 2500,
    countClicks: 0,
    circles: [1, 2, 3],
    activeNumber: -1,
    clicked: false,
    wrongCircle: null,
    wrongCircleCount: 0,
    missedRounds: 0,
    audioEnd: new Audio(gameEnd),
    audioStart: new Audio(gameStart),
    audioClick: new Audio(clickBtn),
    finalText: "",
    rules: false,
    scores: []
  }

  // Initialize state to default values
  initializeState = () => {
    this.setState({
      startGame: true,
      score: 0,
      countRounds: 0,
      countClicks: 0,
      circles: [1, 2, 3],
      activeNumber: -1,
      clicked: false,
      wrongCircle: null,
      wrongCircleCount: 0,
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
    }
    if(!this.state.startGame) {
      this.handleStopGame();
    }
  }

  handleStartGame = () => {
    if(this.state.startGame) {
      this.interval = setInterval(this.randomNumber, this.state.timer);
      this.handleLevelGame();
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
    this.setState({missedRounds: missedRounds});
    if(missedRounds <= 3){
      this.setState({countRounds: this.state.countRounds+1});
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
    if(this.state.level === "Easy") {
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 2500);
    }
    else if(this.state.level === "Medium") {
      this.setState(previousState => ({
        circles: [...previousState.circles, 4]
      }));
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 1800);
    }
    else if(this.state.level === "Hard") {
      this.setState(previousState => ({
        circles: [...previousState.circles, 4]
      }));
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 1100);
    }
    else if(this.state.level === "Professional") {
      this.setState(previousState => ({
        circles: [...previousState.circles, 4, 5]
      }));
      clearInterval(this.interval);
      this.interval = setInterval(this.randomNumber, 800);
    }
  }

  handleScoreGame = () => {
    let score = this.state.score;
    if (score < 4) {
      this.setState({finalText: "Try again!"})
    }
    else if(score >=4 && score < 8) {
      this.setState({finalText: "You need to learn A LOT how to catch up with bugs!"})
    }
    else if(score >=8 && score < 15) {
      this.setState({finalText: "You need to learn a little bit how to catch up with bugs!"})
    }
    else if(score >=15 && score < 30) {
      this.setState({finalText: "Wow... A few lessons more and you will be perfect!"})
    }
    else if(score >=30 && score < 50) {
      this.setState({finalText: "Where did you train this? Nice job!"})
    }
    else if(score >=50) {
      this.setState({finalText: "You are a master! Perfect!"})
    }
  };

  handleStopGame = () => {
    this.setState({finishGame: true});
    this.state.audioEnd.play();
    this.handleScoreGame();
    this.handleScoreTable();
    clearInterval(this.interval);
  }

  handleCloseOverlay = () => {
    this.setState({finishGame: false});
    this.initializeState();
  }

  //firstPage

  handleNameChange = (e) => {
    this.setState({name: e.target.value});
  }

  handleLevelChange = (e) => {
    this.setState({level: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({welcomePage: false})
  }

  handleReturnButton = (e) => {
    e.preventDefault();
    this.setState({welcomePage: !this.state.welcomePage});
  }

  handleRules = (e) => {
    e.preventDefault();
    this.setState({rules: !this.state.rules})
  }

  handleScoreTable = () => {
    let score = this.state.score;
    let name = this.state.name;
    let level = this.state.level;
    let newScore = {name, level, score};
    let scores = this.state.scores;
    scores.push(newScore);
    this.setState({scores});
    localStorage.setItem('scores', JSON.stringify(scores));
    console.log(this.state.scores)
  }

  render() {
    return (
      <div className={classes.gamePage}>
        {/* Game Page */}
        <div className={classes.gameCard}>
          <h1 className={classes.gameName}>Speed Game</h1>
          <div className={classes.lives}>
            <span className={`material-symbols-outlined ${classes.bug_1} ${(this.state.wrongCircleCount + this.state.missedRounds)>=3 ? classes.bug_1_lose  : ""}`}> bug_report </span>
            <span className={`material-symbols-outlined ${classes.bug_2} ${(this.state.wrongCircleCount + this.state.missedRounds)>=2 ? classes.bug_2_lose  : ""}`}> bug_report </span>
            <span className={`material-symbols-outlined ${classes.bug_3} ${(this.state.wrongCircleCount + this.state.missedRounds)>=1 && classes.bug_3_lose}`}> bug_report </span>
          </div>
          <h2>Score {this.state.score}</h2>
          <div className={classes.buttonsCircle}>
            {this.state.circles.map((circle) => <Circle 
              key={circle}
              start={this.state.startGame}
              numberCircles = {this.state.circles.length}
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
          <div className={classes.backMain}>
            <button className={classes.backBtn}><span className={`material-symbols-outlined ${classes.back}`} onClick={this.handleReturnButton}>redo</span></button>
          </div>
        </div>
        {/* Welcome Page */}
        <div className={`${classes.gameCard} ${classes.inputPage} ${!this.state.welcomePage ? classes.closeWelcome : ""}`}>
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
            <div className={classes.help}>
              <button className={classes.helper} onClick={this.handleRules}>
                <span className={`material-symbols-outlined ${classes.rulesInfo}`}> question_mark </span>
              </button>
            </div>
            <GameRules rules={this.state.rules}/>
          </form>
        </div>
      </div>

    );
  }
}
export default App;
