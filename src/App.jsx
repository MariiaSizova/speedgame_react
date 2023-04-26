import React, { Component } from 'react';
import classes from './App.module.css';
import Circle from './components/Circles/Circle';
import GameOver from './components/GameOver/GameOver';
import WelcomeGame from './components/WelcomeGame/WelcomeGame';
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
    livesMissed: 0,
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
      this.interval = setInterval(this.handleGame, this.state.timer);
      this.handleLevelGame();
    }
  }

  handleGame = () => {
    const { countRounds, countClicks, wrongCircleCount } = this.state;
    const missedRounds = countRounds - countClicks;
    const livesMissed = wrongCircleCount + missedRounds;
  
/*     this.setState({ missedRounds }, () => console.log("missedRounds", this.state.missedRounds));
    this.setState({ livesMissed }, () => console.log("livesMissed", this.state.livesMissed, "missedRounds", this.state.missedRounds)); */
    this.setState({ missedRounds, livesMissed})
    this.setState({ countRounds: countRounds + 1 });
    this.setState({ wrongCircle: null }); 
  
    if (livesMissed !== 3) {
      this.randomNumber();
    } else {
      this.handleStopGame();
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
      let nextActive;
      do {
        nextActive = this.getRndInt(1, this.state.circles.length);
      } while (nextActive === this.state.activeNumber);
      this.setState({activeNumber: nextActive}, () => {
      });
      this.changingActiveCircle();
      this.handleSpeedByScore();
  };

  handleSpeedByScore = () => {
    if (this.state.score === 5) {
      this.setState({timer: this.state.timer - 100}, () => console.log(this.state.timer));
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, this.state.timer);
    }
    else if (this.state.score === 10) {
      this.setState({timer: this.state.timer - 200}, () => console.log(this.state.timer));
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, this.state.timer);
    }
    else if (this.state.score === 20) {
      this.setState({timer: this.state.timer - 300}, () => console.log(this.state.timer));
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, this.state.timer);
    }
  } 

  changingActiveCircle = () => {
    this.setState({clicked: false});
  }

  //level choice
  handleLevelGame = () => {
    if(this.state.level === "Easy") {
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, 2500);
    }
    else if(this.state.level === "Medium") {
      this.setState({timer: 1800}, () => console.log(this.state.timer));
      this.setState(previousState => ({
        circles: [...previousState.circles, 4]
      }));
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, 1800);
    }
    else if(this.state.level === "Hard") {
      this.setState(previousState => ({
        circles: [...previousState.circles, 4]
      }));
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, 1100);
    }
    else if(this.state.level === "Professional") {
      this.setState(previousState => ({
        circles: [...previousState.circles, 4, 5]
      }));
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, 800);
    }
  }

  //result message
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
    this.initializeState();
  }

  handleRules = (e) => {
    e.preventDefault();
    this.setState({rules: !this.state.rules})
  }

  handleScoreTable = () => {
    const { score, name, level } = this.state;
    const newScore = { name, level, score };
    const scores = [...this.state.scores];
    const existingIndex = scores.findIndex(
      s => s.name === name && s.level === level
    );
    console.log(existingIndex)
    if (existingIndex === -1) {
      scores.push(newScore);
      console.log(scores)
    } else {
      if (newScore.score > scores[existingIndex].score) {
        scores[existingIndex] = newScore;
      }
    }
    this.setState({ scores });
    console.log(scores)
    console.log(this.state.scores)
  }

  render() {
    return (
      <div className={classes.gamePage}>
        {/* Game Page */}
        <div className={classes.gameCard}>
          <h1 className={classes.gameName}>Speed Game</h1>
          <div className={classes.lives}>
            <span className={`material-symbols-outlined ${classes.bug_1} ${(this.state.livesMissed)>=3 ? classes.bug_1_lose  : ""}`}> bug_report </span>
            <span className={`material-symbols-outlined ${classes.bug_2} ${(this.state.livesMissed)>=2 ? classes.bug_2_lose  : ""}`}> bug_report </span>
            <span className={`material-symbols-outlined ${classes.bug_3} ${(this.state.livesMissed)>=1 ? classes.bug_3_lose : ""}`}> bug_report </span>
          </div>
          <h2>Score {this.state.score}</h2>
          <div className={classes.buttonsCircle}>
            {this.state.circles.map((circle) => 
            <Circle 
              key={circle}
              start={this.state.startGame}
              numberCircles = {this.state.circles.length}
              active={circle === this.state.activeNumber}
              activeNumber={this.state.activeNumber}
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
        <WelcomeGame 
          welcomePage={this.state.welcomePage} 
          name={this.state.name} 
          handleNameChange={this.handleNameChange} 
          level={this.state.level} 
          handleLevelChange={this.handleLevelChange} 
          handleSubmit={this.handleSubmit} 
          handleRules={this.handleRules} 
          rules={this.state.rules}/>
      </div>

    );
  }
}
export default App;
