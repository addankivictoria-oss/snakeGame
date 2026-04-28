/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NEON_COLORS } from '../constants';

const CELL_SIZE = 20;
const GRID_SIZE = 20;

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const moveSnake = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPlaying]);

  const generateFood = (currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((s) => s.x === newFood?.x && s.y === newFood?.y)) {
        break;
      }
    }
    setFood(newFood);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake, isPlaying, isGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = NEON_COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? NEON_COLORS.cyan : NEON_COLORS.cyan + '88';
      ctx.shadowBlur = 10;
      ctx.shadowColor = NEON_COLORS.cyan;
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = NEON_COLORS.magenta;
    ctx.shadowBlur = 15;
    ctx.shadowColor = NEON_COLORS.magenta;
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw grid lines (subtle)
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }
  }, [snake, food]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    generateFood([{ x: 10, y: 10 }]);
  };

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] font-mono text-sm uppercase tracking-widest text-[#888]">
        <div>Score: <span className="text-cyan-400">{score}</span></div>
        <div>High: <span className="text-magenta-400">{highScore}</span></div>
      </div>

      <div className="relative group">
        {/* Neon Glow Frame */}
        <div 
          className="absolute -inset-1 rounded-lg opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
          style={{ 
            background: `linear-gradient(45deg, ${NEON_COLORS.cyan}, ${NEON_COLORS.magenta}, ${NEON_COLORS.cyan})`,
            filter: 'blur(8px)'
          }}
        />
        
        <canvas
          ref={canvasRef}
          width={CELL_SIZE * GRID_SIZE}
          height={CELL_SIZE * GRID_SIZE}
          className="relative bg-black rounded-lg border border-[#333] shadow-2xl"
          id="game-canvas"
        />

        <AnimatePresence>
          {!isPlaying && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
            >
              <div className="text-center p-8">
                {isGameOver ? (
                  <motion.h2 
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-3xl font-bold text-magenta-500 mb-2 uppercase tracking-tighter"
                  >
                    System Error
                  </motion.h2>
                ) : (
                  <motion.h2 
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-3xl font-bold text-cyan-400 mb-2 uppercase tracking-tighter"
                  >
                    Neon Snake
                  </motion.h2>
                )}
                <p className="text-[#888] text-sm mb-6 uppercase tracking-widest">
                  {isGameOver ? 'Link Terminated' : 'Ready for uplink?'}
                </p>
                <button
                  id="start-game-btn"
                  onClick={startGame}
                  className="px-8 py-3 bg-transparent border border-white/20 hover:border-cyan-400 hover:text-cyan-400 text-white rounded-full transition-all duration-300 font-mono text-xs uppercase tracking-widest active:scale-95"
                >
                  {isGameOver ? 'Reboot System' : 'Initiate'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <div />
        <button onClick={() => setDirection({ x: 0, y: -1 })} className="p-4 bg-[#222] rounded-lg">↑</button>
        <div />
        <button onClick={() => setDirection({ x: -1, y: 0 })} className="p-4 bg-[#222] rounded-lg">←</button>
        <button onClick={() => setDirection({ x: 0, y: 1 })} className="p-4 bg-[#222] rounded-lg">↓</button>
        <button onClick={() => setDirection({ x: 1, y: 0 })} className="p-4 bg-[#222] rounded-lg">→</button>
      </div>
      <p className="hidden sm:block text-[#444] text-[10px] uppercase tracking-[0.2em]">Use Arrow Keys to Navigate</p>
    </div>
  );
}
