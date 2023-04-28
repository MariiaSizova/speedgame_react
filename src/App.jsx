import React, { Component } from "react";
import classes from "./App.module.css";
import Circle from "./components/Circles/Circle";
import GameOver from "./components/GameOver/GameOver";
import WelcomeGame from "./components/WelcomeGame/WelcomeGame";
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
    scores: [],
  };

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
      livesMissed: 0,
      finalText: "",
    });
  };

  componentDidMount() {
    this.initializeState();
  }

  handleStartButton = (e) => {
    const { startGame, audioStart } = this.state;
    e.preventDefault();
    this.setState({ startGame: !startGame });
    if (startGame) {
      audioStart.play();
      this.handleStartGame();
    }
    if (!startGame) {
      this.handleStopGame();
    }
  };

  handleStartGame = () => {
    const { startGame, timer } = this.state;
    if (startGame) {
      this.interval = setInterval(this.handleGame, timer);
      this.handleLevelGame();
    }
  };

  handleGame = () => {
    const { countRounds, countClicks, wrongCircleCount } = this.state;
    const missedRounds = countRounds - countClicks;
    const livesMissed = wrongCircleCount + missedRounds;
    this.setState({ missedRounds, livesMissed });
    this.setState({ countRounds: countRounds + 1 });
    this.setState({ wrongCircle: null });

    livesMissed !== 3 ? this.randomNumber() : this.handleStopGame();
  };

  handleCircle = (circle) => {
    const {
      countClicks,
      audioStart,
      audioClick,
      activeNumber,
      clicked,
      score,
      wrongCircleCount,
    } = this.state;
    this.setState({ countClicks: countClicks + 1 });
    audioStart.pause();
    audioClick.play();
    if (activeNumber === circle) {
      !clicked && this.setState({ score: score + 1, clicked: true });
    } else if (activeNumber !== circle) {
      this.setState({ wrongCircle: circle });
      this.setState({
        wrongCircleCount: wrongCircleCount + 1,
        clicked: true,
      });
      if (wrongCircleCount >= 2) {
        this.handleStopGame();
      }
    }
  };

  getRndInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  randomNumber = () => {
    const { circles, activeNumber } = this.state;
    let nextActive;
    do {
      nextActive = this.getRndInt(1, circles.length);
    } while (nextActive === activeNumber);
    this.setState({ activeNumber: nextActive }, () => {});
    this.changingActiveCircle();
    this.handleSpeedByScore();
  };

  handleSpeedByScore = () => {
    const { score, timer } = this.state;
    if (score === 5) {
      this.setState({ timer: timer * 0.95 });
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, timer);
    } else if (score === 10) {
      this.setState({ timer: timer * 0.95 });
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, timer);
    } else if (score === 20) {
      this.setState({ timer: timer * 0.95 });
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, timer);
    }
  };

  changingActiveCircle = () => {
    this.setState({ clicked: false });
  };

  //level choice
  handleLevelGame = () => {
    const { level } = this.state;
    if (level === "Easy") {
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, 2500);
    } else if (level === "Medium") {
      this.setState({ timer: 1800 });
      this.setState((previousState) => ({
        circles: [...previousState.circles, 4],
      }));
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, 1800);
    } else if (level === "Hard") {
      this.setState({ timer: 1100 });
      this.setState((previousState) => ({
        circles: [...previousState.circles, 4],
      }));
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, 1100);
    } else if (level === "Professional") {
      this.setState({ timer: 800 });
      this.setState((previousState) => ({
        circles: [...previousState.circles, 4, 5],
      }));
      clearInterval(this.interval);
      this.interval = setInterval(this.handleGame, 800);
    }
  };

  //Result message
  handleScoreGame = () => {
    let score = this.state.score;
    if (score < 4) {
      this.setState({ finalText: "Try again!" });
    } else if (score >= 4 && score < 8) {
      this.setState({
        finalText: "You need to learn A LOT how to catch up with bugs!",
      });
    } else if (score >= 8 && score < 15) {
      this.setState({
        finalText: "You need to learn a little bit how to catch up with bugs!",
      });
    } else if (score >= 15 && score < 30) {
      this.setState({
        finalText: "Wow... A few lessons more and you will be perfect!",
      });
    } else if (score >= 30 && score < 50) {
      this.setState({ finalText: "Where did you train this? Nice job!" });
    } else if (score >= 50) {
      this.setState({ finalText: "You are a master! Perfect!" });
    }
  };

  handleStopGame = () => {
    this.setState({ finishGame: true });
    this.state.audioEnd.play();
    this.handleScoreGame();
    this.handleScoreTable();
    clearInterval(this.interval);
  };

  handleCloseOverlay = () => {
    this.setState({ finishGame: false });
    this.initializeState();
  };

  //firstPage

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  handleLevelChange = (e) => {
    this.setState({ level: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ welcomePage: false });
  };

  handleReturnButton = (e) => {
    e.preventDefault();
    this.setState({ welcomePage: !this.state.welcomePage });
    this.initializeState();
  };

  handleRules = (e) => {
    e.preventDefault();
    this.setState({ rules: !this.state.rules });
  };

  handleScoreTable = () => {
    const { score, name, level } = this.state;
    const newScore = { name, level, score };
    const scores = [...this.state.scores];
    const existingIndex = scores.findIndex(
      (s) => s.name === name && s.level === level
    );
    if (existingIndex === -1) {
      scores.push(newScore);
    } else {
      if (newScore.score > scores[existingIndex].score) {
        scores[existingIndex] = newScore;
      }
    }
    this.setState({ scores });
  };

  render() {
    return (
      <div className={classes.gamePage}>
        {/* Game Page */}
        <div className={classes.gameCard}>
          <h1 className={classes.gameName}>Speed Game</h1>
          <div className={classes.lives}>
            <span
              className={`material-symbols-outlined ${classes.bug_1} ${
                this.state.livesMissed >= 3 ? classes.bug_1_lose : ""
              }`}
            >
              {" "}
              bug_report{" "}
            </span>
            <span
              className={`material-symbols-outlined ${classes.bug_2} ${
                this.state.livesMissed >= 2 ? classes.bug_2_lose : ""
              }`}
            >
              {" "}
              bug_report{" "}
            </span>
            <span
              className={`material-symbols-outlined ${classes.bug_3} ${
                this.state.livesMissed >= 1 ? classes.bug_3_lose : ""
              }`}
            >
              {" "}
              bug_report{" "}
            </span>
          </div>
          <h2>Score {this.state.score}</h2>
          {/* Circles */}
          <div className={classes.buttonsCircle}>
            {this.state.circles.map((circle) => (
              <Circle
                key={circle}
                start={this.state.startGame}
                numberCircles={this.state.circles.length}
                active={circle === this.state.activeNumber}
                activeNumber={this.state.activeNumber}
                wrongCircle={circle === this.state.wrongCircle}
                handleCircle={() => this.handleCircle(circle)}
                clicked={this.state.clicked}
              />
            ))}
          </div>
          {this.state.startGame ? (
            <button
              className={classes.button_start}
              onClick={this.handleStartButton}
            >
              Start
            </button>
          ) : (
            <button
              className={classes.button_start}
              onClick={this.handleStartButton}
            >
              End
            </button>
          )}
          {this.state.finishGame && (
            <GameOver
              score={this.state.score}
              gameOver={this.state.finishGame}
              handleCloseOverlay={this.handleCloseOverlay}
              finalText={this.state.finalText}
              scores={this.state.scores}
            />
          )}
          <div className={classes.backMain}>
            <button className={classes.backBtn}>
              <span
                className={`material-symbols-outlined ${classes.back} ${
                  !this.state.startGame ? classes.backDisabled : ""
                }`}
                onClick={this.handleReturnButton}
              >
                redo
              </span>
            </button>
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
          rules={this.state.rules}
        />
      </div>
    );
  }
}
export default App;
