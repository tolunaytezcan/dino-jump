import React from 'react';
import './Scoreboard.css';

const Scoreboard = ({ score, highScore }) => {
  return (
    <div className="scoreboard">
      <div className="score">Score: {score}</div>
      <div className="high-score">High Score: {highScore}</div>
    </div>
  );
};

export default Scoreboard; 