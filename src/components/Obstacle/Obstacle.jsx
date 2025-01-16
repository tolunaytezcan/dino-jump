import React, { useState, useEffect, useRef } from 'react';
import './Obstacle.css';

const Obstacle = ({ initialPosition, onCollision, gameOver }) => {
  const [position, setPosition] = useState(initialPosition);
  const obstacleRef = useRef(null);

  useEffect(() => {
    if (gameOver) {
      return;
    }

    const checkCollision = () => {
      const dino = document.querySelector('.dino');
      if (!dino || !obstacleRef.current) return;

      const dinoRect = dino.getBoundingClientRect();
      const obstacleRect = obstacleRef.current.getBoundingClientRect();

      if (
        dinoRect.right > obstacleRect.left &&
        dinoRect.left < obstacleRect.right &&
        dinoRect.bottom > obstacleRect.top
      ) {
        onCollision();
      }
    };

    const moveObstacle = () => {
      setPosition((prevPosition) => {
        if (prevPosition <= -50) {
          return 800 + Math.random() * 600;
        }
        return prevPosition - 8;
      });
    };

    const gameLoop = setInterval(() => {
      moveObstacle();
      checkCollision();
    }, 14);

    return () => clearInterval(gameLoop);
  }, [gameOver, onCollision]);

  return (
    <div
      ref={obstacleRef}
      className="obstacle"
      style={{ left: `${position}px` }}
    />
  );
};

export default Obstacle; 