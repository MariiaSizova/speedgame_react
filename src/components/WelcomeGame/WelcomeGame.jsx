import React from 'react';
import GameRules from '../GameRules/GameRules';
import classes from './WelcomeGame.module.css';

const WelcomeGame = (props) => {
  return (
    <div className={`${classes.gameCard} ${classes.inputPage} ${!props.welcomePage ? classes.closeWelcome : ""}`}>
      <h1 className={classes.welcome}>Welcome to Speed Game</h1>
      <form onSubmit={props.handleSubmit}>
        <div className={classes.nameInput}>
          <label htmlFor="username">Nickname</label>
          <input type="text" id="username" name="username" value={props.name} onChange={props.handleNameChange} required/>
        </div>
        <div className={classes.levelInput}>
          <label htmlFor="level">Choose a level</label>
          <select name="level" id="level" value={props.level} onChange={props.handleLevelChange} required>
            <option value="" invalid="true" hidden>Choose a level...</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Professional">Professional</option>
          </select>
        </div>
        <button className={`${classes.btn}`} type="submit">Submit</button>
      </form>
      <div className={classes.help}>
        <button className={classes.helper} onClick={props.handleRules}>
          <span className={`material-symbols-outlined ${classes.rulesInfo}`}> question_mark </span>
        </button>
      </div>
      <GameRules rules={props.rules} handleRules={props.handleRules}/>
    </div>
  );
};

export default WelcomeGame;