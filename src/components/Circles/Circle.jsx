import React from 'react';
import classes from './Circle.module.css';

const Circle = (props) => {
  return (
    <div>
      <button className={classes.circle} onClick={props.handleCircle}></button>
    </div>
  );
};

export default Circle;