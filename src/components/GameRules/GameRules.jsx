import React from "react";
import classes from "./GameRules.module.css";

const GameRules = (props) => {
  return (
    <div
      className={`${classes.overlay_rules} ${
        props.rules && classes.visibleRules
      }`}
    >
      <div className={classes.rules}>
        <button className={`${classes.btn}`} onClick={props.handleRules}>
          <span className={`material-symbols-outlined ${classes.closeRules}`}>
            {" "}
            close{" "}
          </span>
        </button>
        <h2 className={classes.overlayRules_title}>How to play?</h2>
        <ol className={classes.rules_list}>
          <li>The game starts with all the lights off.</li>
          <li>
            The lights turn on one at a time in random order, accelerating all
            the time.
          </li>
          <li>
            Each light illumination is acknowledged by pressing the light button
            that comes on.
          </li>
          <li>
            If you press the correct button, the game continues with the next
            light button. Your score will increase.
          </li>
          <li>
            The game continues until you make three mistakes or skip three
            lights.
          </li>
          <li>
            Your score is based on how many buttons you correctly press before
            the game ends. The higher your score, the better you did.
          </li>
          <li>
            The game can be stopped at any time by pressing a stop button.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default GameRules;
