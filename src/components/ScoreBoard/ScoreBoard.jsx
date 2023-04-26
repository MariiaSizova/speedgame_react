import React from 'react';
import classes from './ScoreBoard.module.css';

const ScoreBoard = (props) => {
  return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Level</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {props.scores.map(score => (
            <tr key={score.name + score.level}>
              <td>{score.name}</td>
              <td>{score.level}</td>
              <td>{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
  );
};

export default ScoreBoard;