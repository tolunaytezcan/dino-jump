import React, { useEffect, useRef } from 'react';
import './Ground.css';

const Ground = ({ speed, gameOver }) => {
    const ground1Ref = useRef(null);
    const ground2Ref = useRef(null);
    const positionRef = useRef(0);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        let lastTime = 0;

        const animate = (currentTime) => {
            if (!ground1Ref.current || !ground2Ref.current || gameOver) return;

            if (lastTime !== 0) {
                const deltaTime = currentTime - lastTime;
                positionRef.current -= (speed * deltaTime) / 16;

                ground1Ref.current.style.transform = `translateX(${positionRef.current}px)`;
                ground2Ref.current.style.transform = `translateX(${positionRef.current}px)`;

                if (positionRef.current <= -1200) {
                    positionRef.current = 0;
                }
            }

            lastTime = currentTime;
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [speed, gameOver]);

    return (
        <div className="ground-container">
            <div ref={ground1Ref} className="ground ground-1" />
            <div ref={ground2Ref} className="ground ground-2" />
        </div>
    );
};

export default Ground; 