import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';

const GRID_SIZE = 8;
const INITIAL_PLAYER_POSITION = { x: 4, y: 4 };
const INITIAL_NOODLE_COUNT = 5;
const INITIAL_OBSTACLE_COUNT = 3;
const INITIAL_TIME = 60;

const NoodleQuest = () => {
  const [gameState, setGameState] = useState({
    playerPosition: INITIAL_PLAYER_POSITION,
    noodles: [],
    obstacles: [],
    score: 0,
    timeLeft: INITIAL_TIME,
    gameOver: false,
    paused: false,
    muted: false,
    health: 100,
  });

  const initializeGame = useCallback(() => {
    const newNoodles = Array.from({ length: INITIAL_NOODLE_COUNT }, () => ({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }));

    const newObstacles = Array.from({ length: INITIAL_OBSTACLE_COUNT }, () => ({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }));

    setGameState({
      playerPosition: INITIAL_PLAYER_POSITION,
      noodles: newNoodles,
      obstacles: newObstacles,
      score: 0,
      timeLeft: INITIAL_TIME,
      gameOver: false,
      paused: false,
      health: 100,
    });
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let timer;
    if (!gameState.gameOver && !gameState.paused) {
      timer = setInterval(() => {
        setGameState((prevState) => {
          const newTimeLeft = prevState.timeLeft - 1;
          if (newTimeLeft <= 0) {
            clearInterval(timer);
            return { ...prevState, gameOver: true, timeLeft: 0 };
          }
          return { ...prevState, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.gameOver, gameState.paused]);

  const movePlayer = useCallback(
    (dx, dy) => {
      if (gameState.gameOver || gameState.paused) return;

      setGameState((prevState) => {
        const newX = Math.max(0, Math.min(GRID_SIZE - 1, prevState.playerPosition.x + dx));
        const newY = Math.max(0, Math.min(GRID_SIZE - 1, prevState.playerPosition.y + dy));
        const newPosition = { x: newX, y: newY };

        let newScore = prevState.score;
        let newNoodles = [...prevState.noodles];
        let newHealth = prevState.health;

        // Check for noodle collection
        const noodleIndex = newNoodles.findIndex(
          (noodle) => noodle.x === newX && noodle.y === newY
        );
        if (noodleIndex !== -1) {
          newScore += 10;
          newNoodles.splice(noodleIndex, 1);
          newNoodles.push({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        }

        // Check for obstacle collision
        const hitObstacle = prevState.obstacles.some(
          (obstacle) => obstacle.x === newX && obstacle.y === newY
        );
        if (hitObstacle) {
          newHealth -= 10;
        }

        return {
          ...prevState,
          playerPosition: newPosition,
          score: newScore,
          noodles: newNoodles,
          health: newHealth,
          gameOver: newHealth <= 0,
        };
      });
    },
    [gameState.gameOver, gameState.paused]
  );

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
          movePlayer(1, 0);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  const renderGrid = () => {
    return (
      <div className="grid grid-cols-8 gap-1 w-full max-w-xs mx-auto">
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          let cellContent = '';

          if (gameState.playerPosition.x === x && gameState.playerPosition.y === y) {
            cellContent = '🍜';
          } else if (gameState.noodles.some((noodle) => noodle.x === x && noodle.y === y)) {
            cellContent = '🍚';
          } else if (gameState.obstacles.some((obstacle) => obstacle.x === x && obstacle.y === y)) {
            cellContent = '🧱';
          }

          return (
            <div
              key={`${x}-${y}`}
              className="w-8 h-8 flex items-center justify-center bg-yellow-100 text-xl rounded-md"
            >
              {cellContent}
            </div>
          );
        })}
      </div>
    );
  };

  const togglePause = () => {
    setGameState((prevState) => ({ ...prevState, paused: !prevState.paused }));
  };

  const toggleMute = () => {
    setGameState((prevState) => ({ ...prevState, muted: !prevState.muted }));
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gradient-to-b from-blue-500 to-purple-600 text-white p-4">
      <h1 className="text-3xl font-bold mb-2">Noodle Quest</h1>

      <div className="flex justify-between w-full max-w-xs mb-2">
        <div>Score: {gameState.score}</div>
        <div>Time: {gameState.timeLeft}s</div>
        <div>Health: {gameState.health}%</div>
      </div>

      {renderGrid()}

      <div className="flex justify-center space-x-4 mt-4">
        <button onClick={() => movePlayer(0, -1)} className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500">
          <ArrowUp />
        </button>
        <button onClick={() => movePlayer(-1, 0)} className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500">
          <ArrowLeft />
        </button>
        <button onClick={() => movePlayer(1, 0)} className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500">
          <ArrowRight />
        </button>
        <button onClick={() => movePlayer(0, 1)} className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500">
          <ArrowDown />
        </button>
      </div>

      <div className="mt-4 flex space-x-4">
        <button onClick={togglePause} className="p-2 bg-blue-500 rounded-full hover:bg-blue-600">
          {gameState.paused ? <Play /> : <Pause />}
        </button>
        <button onClick={toggleMute} className="p-2 bg-red-500 rounded-full hover:bg-red-600">
          {gameState.muted ? <VolumeX /> : <Volume2 />}
        </button>
      </div>

      {gameState.gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-4 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <p>Final Score: {gameState.score}</p>
            <button
              onClick={initializeGame}
              className="mt-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoodleQuest;