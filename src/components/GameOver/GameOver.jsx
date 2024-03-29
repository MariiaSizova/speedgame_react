import React from 'react';
import classes from './GameOver.module.css';
import ScoreBoard from '../ScoreBoard/ScoreBoard';

const GameOver = (props) => {
  return (
    <div className={`${classes.overlay} ${(props.gameOver ? classes.gameEnd : "")}`}>
      <div className={classes.gameOver}>
        <button className={`${classes.btn} ${classes.btnClose}`} onClick={props.handleCloseOverlay}>
          <span className={`material-symbols-outlined ${classes.closeGameOver}`}> X </span>
        </button>
        <h2 className={classes.overlay_title}>👾 Game over 👾</h2>
        <h3 className={classes.overlay_score}>
          You caught <span id="result">{props.score}</span> bugs
        </h3>
        <p className={classes.overlay_paragraph}>
          <span id="overlay_text">{props.finalText}</span>
        </p>
        <ScoreBoard scores={props.scores}/>
      </div>
    </div>
  );
};

export default GameOver;