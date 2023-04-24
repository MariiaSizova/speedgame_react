import React from 'react';
import classes from './Circle.module.css';

const Circle = (props) => {
  return (
    <div>
      <button className={`${classes.circle} ${(props.active&&!props.start) ? classes.activeCircle : ''} ${(props.start) || (props.clicked) ? classes.endGame : ''} ${(props.wrongCircle) ? classes.wrongCircle : ''}`} onClick={props.handleCircle}></button>
    </div>
    
  );
};

export default Circle;