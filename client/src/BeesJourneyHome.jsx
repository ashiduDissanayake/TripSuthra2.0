import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

const GRID_SIZE = 8;
const FLOWER_COUNT = 5;

const BeesJourneyHome = () => {
  const [maze, setMaze] = useState([]);
  const [beePosition, setBeePosition] = useState({ x: 0, y: 0 });
  const [hivePosition, setHivePosition] = useState({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });
  const [moves, setMoves] = useState(0);
  const [flowersCollected, setFlowersCollected] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const generateMaze = useCallback(() => {
    // Initialize maze with empty cells
    const newMaze = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill('empty'));
    
    // Set start (bee) and end (hive) positions
    newMaze[0][0] = 'bee';
    newMaze[GRID_SIZE - 1][GRID_SIZE - 1] = 'hive';
    
    // Add flowers
    for (let i = 0; i < FLOWER_COUNT; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
      } while (newMaze[y][x] !== 'empty');
      newMaze[y][x] = 'flower';
    }
    
    // Add some random barriers (trees)
    for (let i = 0; i < GRID_SIZE * 2; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
      } while (newMaze[y][x] !== 'empty' || (x === 0 && y === 0) || (x === GRID_SIZE - 1 && y === GRID_SIZE - 1));
      newMaze[y][x] = 'tree';
    }
    
    // Ensure the maze is solvable
    const visited = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
    const dfs = (x, y) => {
      if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE || visited[y][x] || newMaze[y][x] === 'tree') return false;
      if (x === GRID_SIZE - 1 && y === GRID_SIZE - 1) return true;
      visited[y][x] = true;
      return dfs(x + 1, y) || dfs(x - 1, y) || dfs(x, y + 1) || dfs(x, y - 1);
    };
    
    if (!dfs(0, 0)) {
      // If not solvable, recursively generate a new maze
      return generateMaze();
    }
    
    return newMaze;
  }, []);

  const initializeGame = useCallback(() => {
    const newMaze = generateMaze();
    setMaze(newMaze);
    setBeePosition({ x: 0, y: 0 });
    setHivePosition({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });
    setMoves(0);
    setFlowersCollected(0);
    setGameWon(false);
  }, [generateMaze]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const moveBee = useCallback((dx, dy) => {
    if (gameWon) return;

    setBeePosition((prevPos) => {
      const newX = Math.max(0, Math.min(GRID_SIZE - 1, prevPos.x + dx));
      const newY = Math.max(0, Math.min(GRID_SIZE - 1, prevPos.y + dy));
      
      if (maze[newY][newX] !== 'tree') {
        setMoves((prevMoves) => prevMoves + 1);
        if (maze[newY][newX] === 'flower') {
          setFlowersCollected((prev) => prev + 1);
          setMaze((prevMaze) => {
            const newMaze = [...prevMaze];
            newMaze[newY][newX] = 'empty';
            return newMaze;
          });
        }
        if (newX === hivePosition.x && newY === hivePosition.y) {
          setGameWon(true);
        }
        return { x: newX, y: newY };
      }
      return prevPos;
    });
  }, [maze, hivePosition, gameWon]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp': moveBee(0, -1); break;
        case 'ArrowDown': moveBee(0, 1); break;
        case 'ArrowLeft': moveBee(-1, 0); break;
        case 'ArrowRight': moveBee(1, 0); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveBee]);

  const renderMaze = () => (
    <div className="grid grid-cols-8 gap-1 w-full max-w-xs mx-auto bg-sky-200 p-2 rounded-lg">
      {maze.map((row, y) => 
        row.map((cell, x) => (
          <div 
            key={`${x}-${y}`} 
            className={`w-8 h-8 flex items-center justify-center rounded-sm
              ${cell === 'tree' ? 'bg-green-700' : 'bg-yellow-100'}
              ${x === beePosition.x && y === beePosition.y ? 'bg-yellow-400' : ''}
              ${cell === 'hive' ? 'bg-orange-300' : ''}
            `}
          >
            {x === beePosition.x && y === beePosition.y && '🐝'}
            {cell === 'flower' && '🌼'}
            {cell === 'tree' && '🌳'}
            {cell === 'hive' && '🏠'}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gradient-to-b from-sky-300 to-green-300 text-slate-800 p-4">
      <h1 className="text-3xl font-bold mb-2 text-yellow-600">Bee's Journey Home</h1>

      <div className="text-center mb-2">
        <div className="text-lg">Moves: {moves} | Flowers: {flowersCollected}/{FLOWER_COUNT}</div>
        {gameWon && (
          <div className="text-xl font-bold text-yellow-600 bg-white p-2 rounded-full animate-bounce">
            Hooray! Bee is home! 🎉
          </div>
        )}
      </div>

      {renderMaze()}

      <div className="flex justify-center space-x-4 mt-4">
        <button onClick={() => moveBee(0, -1)} className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 text-slate-800">
          <ArrowUp />
        </button>
        <button onClick={() => moveBee(-1, 0)} className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 text-slate-800">
          <ArrowLeft />
        </button>
        <button onClick={() => moveBee(1, 0)} className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 text-slate-800">
          <ArrowRight />
        </button>
        <button onClick={() => moveBee(0, 1)} className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 text-slate-800">
          <ArrowDown />
        </button>
      </div>

      <button 
        onClick={initializeGame} 
        className="mt-4 p-2 bg-green-500 rounded-full hover:bg-green-600 flex items-center text-white"
      >
        <RotateCcw className="mr-2" /> New Game
      </button>
    </div>
  );
};

export default BeesJourneyHome;