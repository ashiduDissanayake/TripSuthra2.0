import { useState, useEffect, useCallback } from "react";
import Video from "./assets/BeeV.mp4";
import BeePlay from "./assets/BeePlay.png";
import BeeDesc from "./assets/BeeD.png";
import {
  Hexagon,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const GRID_SIZES = [8, 10, 12, 15];
const MAX_LEVEL = 4;

const MazeQuest = () => {
  const [gameState, setGameState] = useState("start"); // "start", "intro", "playing", "over"
  const [level, setLevel] = useState(1);
  const [maze, setMaze] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [exitPosition, setExitPosition] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [autoSolve, setAutoSolve] = useState(false);
  const [energy, setEnergy] = useState(100);

  const GRID_SIZE = GRID_SIZES[level - 1];

  const generateMaze = useCallback(() => {
    const newMaze = Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill("empty"));
    newMaze[0][0] = "player";
    newMaze[GRID_SIZE - 1][GRID_SIZE - 1] = "exit";

    for (let i = 0; i < GRID_SIZE * 2; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
      } while (
        newMaze[y][x] !== "empty" ||
        (x === 0 && y === 0) ||
        (x === GRID_SIZE - 1 && y === GRID_SIZE - 1)
      );
      newMaze[y][x] = "wall";
    }

    // Add power-ups
    for (let i = 0; i < GRID_SIZE; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
      } while (
        newMaze[y][x] !== "empty" ||
        (x === 0 && y === 0) ||
        (x === GRID_SIZE - 1 && y === GRID_SIZE - 1)
      );
      newMaze[y][x] = "power-up";
    }

    const visited = Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(false));
    const dfs = (x, y) => {
      if (
        x < 0 ||
        y < 0 ||
        x >= GRID_SIZE ||
        y >= GRID_SIZE ||
        visited[y][x] ||
        newMaze[y][x] === "wall"
      )
        return false;
      if (x === GRID_SIZE - 1 && y === GRID_SIZE - 1) return true;
      visited[y][x] = true;
      return dfs(x + 1, y) || dfs(x - 1, y) || dfs(x, y + 1) || dfs(x, y - 1);
    };

    if (!dfs(0, 0)) {
      return generateMaze();
    }

    return newMaze;
  }, [GRID_SIZE]);

  const initializeGame = useCallback(() => {
    const newMaze = generateMaze();
    setMaze(newMaze);
    setPlayerPosition({ x: 0, y: 0 });
    setExitPosition({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });
    setMoves(0);
    setGameWon(false);
    setGameOver(false);
    setEnergy(100);
  }, [generateMaze, GRID_SIZE]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame, level]);

  const movePlayer = useCallback(
    (dx, dy) => {
      if (gameWon || gameOver) return;

      setPlayerPosition((prevPos) => {
        const newX = Math.max(0, Math.min(GRID_SIZE - 1, prevPos.x + dx));
        const newY = Math.max(0, Math.min(GRID_SIZE - 1, prevPos.y + dy));

        if (maze[newY][newX] !== "wall") {
          setMoves((prevMoves) => prevMoves + 1);
          setEnergy((prevEnergy) => Math.max(0, prevEnergy - 1));

          if (maze[newY][newX] === "power-up") {
            setEnergy((prevEnergy) => Math.min(100, prevEnergy + 20));
          }

          setMaze((prevMaze) => {
            const newMaze = [...prevMaze];
            newMaze[prevPos.y][prevPos.x] = "empty";
            newMaze[newY][newX] = "player";
            return newMaze;
          });

          if (newX === exitPosition.x && newY === exitPosition.y) {
            setGameWon(true);
            alert(`Level Complete! You solved the maze in ${moves + 1} moves!`);
          }

          return { x: newX, y: newY };
        }
        return prevPos;
      });
    },
    [maze, exitPosition, gameWon, gameOver, GRID_SIZE, moves]
  );

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -1);
          break;
        case "ArrowDown":
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
          movePlayer(1, 0);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [movePlayer]);

  useEffect(() => {
    if (gameWon) {
      if (level < MAX_LEVEL) {
        setTimeout(() => setLevel((prevLevel) => prevLevel + 1), 2000);
      } else {
        setGameOver(true);
        alert("Congratulations! You've completed all levels!");
      }
    }
  }, [gameWon, level]);

  useEffect(() => {
    if (energy === 0) {
      setGameOver(true);
      alert("Game Over! You've run out of energy!");
    }
  }, [energy]);

  const solveMaze = useCallback(() => {
    const visited = Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(false));
    const solution = [];

    const dfs = (x, y) => {
      if (x === exitPosition.x && y === exitPosition.y) return true;
      if (
        x < 0 ||
        y < 0 ||
        x >= GRID_SIZE ||
        y >= GRID_SIZE ||
        maze[y][x] === "wall" ||
        visited[y][x]
      )
        return false;

      visited[y][x] = true;
      solution.push({ x, y });

      const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];

      for (let [dx, dy] of directions) {
        if (dfs(x + dx, y + dy)) return true;
      }

      solution.pop();
      return false;
    };

    dfs(playerPosition.x, playerPosition.y);
    return solution;
  }, [maze, exitPosition, GRID_SIZE, playerPosition]);

  useEffect(() => {
    if (autoSolve) {
      const solution = solveMaze();
      let i = 0;
      const interval = setInterval(() => {
        if (i < solution.length) {
          const { x, y } = solution[i];
          setPlayerPosition({ x, y });
          setMaze((prevMaze) => {
            const newMaze = [...prevMaze];
            newMaze[y][x] = "player";
            if (i > 0) {
              const { x: prevX, y: prevY } = solution[i - 1];
              newMaze[prevY][prevX] = "empty";
            }
            return newMaze;
          });
          i++;
        } else {
          clearInterval(interval);
          setAutoSolve(false);
          setGameWon(true);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [autoSolve, solveMaze]);

  const renderMaze = () => (
    <div
      className="grid gap-1 w-full max-w-md mx-auto bg-slate-100 p-2 rounded-lg shadow-inner"
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
    >
      {maze.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`
        aspect-square flex items-center justify-center rounded-sm
        ${cell === "wall" ? "bg-slate-700" : "bg-slate-300"}
        ${cell === "player" ? "bg-yellow-400" : ""}
        ${cell === "exit" ? "bg-green-500" : ""}
        ${cell === "power-up" ? "bg-blue-400" : ""}
      `}
          >
            {cell === "player" && "🐝"}
            {cell === "exit" && "🏠"}
            {cell === "power-up" && "⚡"}
          </div>
        ))
      )}
    </div>
  );

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-100 to-green-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
          <p className="mb-4">
            You've {gameWon ? "completed all levels!" : "run out of energy!"}
          </p>
          <div className="text-6xl mb-8">{gameWon ? "🏆🐝🍯" : "😢🐝💤"}</div>
          <button
            onClick={() => {
              setLevel(1);
              initializeGame();
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const StartPage = () => (
    <>
      <div className="h-[80vh] overflow-hidden">
        {/* Video that covers the full screen */}
        <video
          src={Video}
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 "
        />

        {/* Link button with the BeePlay image */}
        <img
          src={BeePlay}
          alt="Play Button"
          className="absolute top-3/4 left-[620px] h-32 object-contain cursor-pointer animate-scale"
          onClick={() => {
            setGameState("intro");
          }}
        />
      </div>
    </>
  );

  const IntroPage = () => (
    <div className="flex items-center justify-center bg-gradient-to-b from-yellow-100 to-green-100 p-4 bg-cover">
      <img src={BeeDesc} alt="Bee Description" className="absolute z-0" />
      <div className="bg-amber-50 rounded-3xl shadow-2xl p-8 max-w-2xl w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {[...Array(20)].map((_, i) => (
            <Hexagon
              key={i}
              className="text-amber-500 absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              size={48}
            />
          ))}
        </div>
        <h2 className="text-4xl font-extrabold mb-6 text-amber-700 text-center">
          How to Play
        </h2>
        <ul className="list-none mb-8 space-y-4">
          {[
            {
              icon: "🐝",
              text: "Use arrow keys or on-screen buttons to move the bee through the maze.",
            },
            { icon: "🏠", text: "Find the hive to complete each level." },
            { icon: "⚡", text: "Collect power-ups to boost your energy." },
            {
              icon: "🔋",
              text: "Watch your energy level - if it reaches zero, the game is over!",
            },
            { icon: "🏆", text: "Complete all 4 levels to win the game." },
          ].map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="text-2xl mr-4">{item.icon}</span>
              <span className="text-amber-900">{item.text}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between">
          <button
            onClick={() => setGameState("start")}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={() => {
              setGameState("playing");
              initializeGame();
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );

  // Modify the existing game over screen to include a "Back to Start" button
  const GameOverScreen = () => (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-green-100 p-4">
      <div className="bg-gray-500 rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <p className="mb-4">
          You've {gameWon ? "completed all levels!" : "run out of energy!"}
        </p>
        <div className="text-6xl mb-8">{gameWon ? "🏆🐝🍯" : "😢🐝💤"}</div>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setLevel(1);
              initializeGame();
              setGameState("playing");
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
          <button
            onClick={() => {
              setGameState("start");
              setLevel(1);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to Start
          </button>
        </div>
      </div>
    </div>
  );

  // Main render function
  if (gameState === "start") {
    return <StartPage />;
  } else if (gameState === "intro") {
    return <IntroPage />;
  } else if (gameState === "over" || gameWon) {
    return <GameOverScreen />;
  }

  // The main game screen (previously the default return)
  return (
    <div className="relative  w-full">

      {/* Main Game Container */}
      <div className="relative flex items-center justify-center  z-10">
        <div className="bg-amber-50/90 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
          {/* Game Info Box */}
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-center mb-4 text-amber-800">
              MazeQuest: The Hive Explorer
            </h2>
            <div className="flex justify-between items-center mb-2 text-amber-700">
              <span>Level: {level}</span>
              <span>Moves: {moves}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-amber-700">Energy:</span>
              <div className="flex-grow bg-amber-200 rounded-full h-4">
                <div
                  className="bg-amber-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${energy}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Render the Maze */}
          {renderMaze()}

          {/* Movement controls are still commented out as in the original code */}
          <div className="bg-amber-100 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-2">
              <div></div>
              <button
                onClick={() => movePlayer(0, -1)}
                aria-label="Move Up"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                <ChevronUp size={24} />
              </button>
              <div></div>

              <button
                onClick={() => movePlayer(-1, 0)}
                aria-label="Move Left"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => movePlayer(0, 1)}
                aria-label="Move Down"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                <ChevronDown size={24} />
              </button>
              <button
                onClick={() => movePlayer(1, 0)}
                aria-label="Move Right"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeQuest;
