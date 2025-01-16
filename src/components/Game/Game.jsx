import React, { useState, useEffect, useCallback, useRef } from 'react';
import Dino from '../Dino/Dino';
import Ground from '../Ground/Ground';
import Obstacle from '../Obstacle/Obstacle';
import Scoreboard from '../Scoreboard/Scoreboard';
import './Game.css';

const POINT_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3';
const MENU_MUSIC = 'https://assets.mixkit.co/active_storage/sfx/943/943-preview.mp3';
const GAME_OVER_SOUND = 'https://assets.mixkit.co/active_storage/sfx/1021/1021-preview.mp3';

const Game = () => {
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [obstacles, setObstacles] = useState([]);
    const [highScore, setHighScore] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const pointSoundRef = useRef(new Audio(POINT_SOUND));
    const gameOverSoundRef = useRef(new Audio(GAME_OVER_SOUND));
    const menuMusicRef = useRef(new Audio(MENU_MUSIC));

    useEffect(() => {
        pointSoundRef.current.volume = 0.2;
        gameOverSoundRef.current.volume = 0.3;
        menuMusicRef.current.volume = 0.3;
        menuMusicRef.current.loop = true;

        pointSoundRef.current.load();
        gameOverSoundRef.current.load();
        menuMusicRef.current.load();

        menuMusicRef.current.play().catch(error => console.log('Error playing menu music:', error));

        return () => {
            menuMusicRef.current.pause();
            menuMusicRef.current.currentTime = 0;
        };
    }, []);

    useEffect(() => {
        if (!isPlaying && !gameOver) {
            menuMusicRef.current.currentTime = 0;
            menuMusicRef.current.play().catch(error => console.log('Error playing menu music:', error));
        } else if (!isPlaying && gameOver) {
            menuMusicRef.current.currentTime = 0;
            menuMusicRef.current.play().catch(error => console.log('Error playing menu music:', error));
        } else {
            menuMusicRef.current.pause();
            menuMusicRef.current.currentTime = 0;
        }
    }, [isPlaying, gameOver]);

    useEffect(() => {
        const savedHighScore = localStorage.getItem('highScore');
        const savedTheme = localStorage.getItem('theme');

        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore));
        }

        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        const handleKeyPress = (event) => {
            if (event.code === 'Space' && (!isPlaying || gameOver)) {
                event.preventDefault();
                startGame();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            menuMusicRef.current.pause();
        };
    }, [isPlaying, gameOver]);

    const toggleTheme = () => {
        setIsDarkMode(prev => {
            const newTheme = !prev;
            document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            return newTheme;
        });
    };

    const startGame = () => {
        setGameOver(false);
        setScore(0);
        setIsPlaying(true);
        setObstacles([
            { id: 1, position: 800 },
            { id: 2, position: 1400 }
        ]);

        menuMusicRef.current.pause();
        menuMusicRef.current.currentTime = 0;
        gameOverSoundRef.current.pause();
        gameOverSoundRef.current.currentTime = 0;
    };

    const handleGameOver = useCallback(() => {
        setGameOver(true);
        setIsPlaying(false);

        gameOverSoundRef.current.currentTime = 0;
        gameOverSoundRef.current.play();

        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('highScore', score.toString());
        }
    }, [score, highScore]);

    useEffect(() => {
        let scoreInterval;
        if (isPlaying) {
            scoreInterval = setInterval(() => {
                setScore(prevScore => {
                    const newScore = prevScore + 1;
                    if (newScore % 100 === 0) {
                        pointSoundRef.current.currentTime = 0;
                        pointSoundRef.current.play();
                    }
                    return newScore;
                });
            }, 100);
        }
        return () => clearInterval(scoreInterval);
    }, [isPlaying]);

    const handleCollision = useCallback(() => {
        handleGameOver();
    }, [handleGameOver]);

    return (
        <div className="game">
            <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>

            {!isPlaying && !gameOver && (
                <div className="start-screen">
                    <h1>DINO JUMP</h1>
                    <p>High Score: {highScore}</p>
                    <button onClick={startGame}>Start Game</button>
                    <div className="controls-info">
                        <p>Controls:</p>
                        <p><span>↑</span> or <span>SPACE</span> to jump</p>
                        <p><span>↓</span> or <span>S</span> to fast fall</p>
                        <p><span>SPACE</span> to start/restart game</p>
                    </div>
                </div>
            )}

            {isPlaying && (
                <>
                    <Scoreboard score={score} highScore={highScore} />
                    <div className="game-area">
                        <Dino onCollision={handleCollision} gameOver={gameOver} />
                        <Ground speed={5} gameOver={gameOver} />
                        {obstacles.map(obstacle => (
                            <Obstacle
                                key={obstacle.id}
                                initialPosition={obstacle.position}
                                onCollision={handleCollision}
                                gameOver={gameOver}
                            />
                        ))}
                    </div>
                </>
            )}

            {gameOver && (
                <div className="game-over">
                    <h2>Game Over!</h2>
                    <p className="score">Score: {score}</p>
                    <p className="high-score">High Score: {highScore}</p>
                    <div className="buttons">
                        <button className="home-button" onClick={() => {
                            setGameOver(false);
                            setIsPlaying(false);
                        }}>⌂</button>
                        <button onClick={startGame}>Play Again</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game; 