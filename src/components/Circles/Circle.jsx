import React from 'react';
import classes from './Circle.module.css';

const Circle = (props) => {
  return (
    <div>
      <button className={`${classes.circle} ${(props.active&&!props.start) ? classes.activeCircle : ''} ${(props.start) || (props.clicked) || (props.activeNumber === -1) ? classes.endGame : ''} ${(props.wrongCircle) ? classes.wrongCircle : ''} ${(props.numberCircles > 4) ? classes.circleHard : ''}`} onClick={props.handleCircle}></button>
      
    </div>
    
  );
};

export default Circle;