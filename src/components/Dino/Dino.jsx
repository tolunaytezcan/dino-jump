import React, { useState, useEffect, useCallback } from 'react';
import './Dino.css';

const JUMP_SPEED = 5;
const GRAVITY = 0.3;
const TERMINAL_VELOCITY = -12;
const FAST_FALL_SPEED = -20;

const Dino = ({ onCollision, gameOver }) => {
    const [position, setPosition] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [isFastFalling, setIsFastFalling] = useState(false);

    const playJumpSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(error => console.log('Error playing sound:', error));
    };

    const jump = useCallback(() => {
        if (!isJumping && !gameOver) {
            setVelocity(JUMP_SPEED);
            setIsJumping(true);
            setIsFastFalling(false);
            playJumpSound();
        }
    }, [isJumping, gameOver]);

    const fastFall = useCallback(() => {
        if (!gameOver && position > 0) {
            setVelocity(FAST_FALL_SPEED);
            setIsFastFalling(true);
        }
    }, [gameOver, position]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.code === 'ArrowUp' || event.code === 'Space') && !isJumping && !gameOver) {
                jump();
            }
            if ((event.code === 'ArrowDown' || event.key.toLowerCase() === 's') && !gameOver && position > 0) {
                fastFall();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isJumping, gameOver, position]);

    useEffect(() => {
        if (gameOver) {
            return;
        }

        const gameLoop = setInterval(() => {
            setPosition((prevPosition) => {
                const newPosition = prevPosition + velocity;
                
                if (newPosition <= 0) {
                    setVelocity(0);
                    setIsJumping(false);
                    setIsFastFalling(false);
                    return 0;
                }
                
                if (!isFastFalling) {
                    setVelocity((prevVelocity) => {
                        const newVelocity = prevVelocity - GRAVITY;
                        return Math.max(newVelocity, TERMINAL_VELOCITY);
                    });
                }
                
                return newPosition;
            });
        }, 16);

        return () => clearInterval(gameLoop);
    }, [velocity, gameOver, isFastFalling]);

    return (
        <div 
            className={`dino ${isJumping ? 'jumping' : ''} ${isFastFalling ? 'fast-falling' : ''}`}
            style={{ 
                bottom: `${position}px`,
                transition: `transform ${16/1000}s linear`
            }}
            onClick={jump}
        />
    );
};

export default Dino; 