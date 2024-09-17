import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import confetti from "canvas-confetti";

// Import images (assuming these imports work in your project structure)
import Back from "./assets/back.jpg";
import Darkness from "./assets/darkness.jpg";
import Double from "./assets/double.jpg";
import Fairy from "./assets/fairy.jpg";
import Fighting from "./assets/fighting.jpg";
import Fire from "./assets/fire.jpg";
import Grass from "./assets/grass.jpg";
import Lightning from "./assets/lightning.jpg";
import Metal from "./assets/metal.jpg";
import Psychic from "./assets/psychic.jpg";
import Water from "./assets/water.jpg";

const imageMap = {
  darkness: Darkness,
  double: Double,
  fairy: Fairy,
  fighting: Fighting,
  fire: Fire,
  grass: Grass,
  lightning: Lightning,
  metal: Metal,
  psychic: Psychic,
  water: Water,
};

const cardList = Object.keys(imageMap);

const MemoryGame = () => {
  const [board, setBoard] = useState([]);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);
  const [selectedCards, setSelectedCards] = useState([]);
  const [errors, setErrors] = useState(0);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameState, setGameState] = useState("start"); // "start", "playing", "paused", "gameOver"
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [powerUp, setPowerUp] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const shuffleCards = useCallback(() => {
    let cardSet = cardList
      .slice(0, (rows * columns) / 2)
      .concat(cardList.slice(0, (rows * columns) / 2));
    for (let i = cardSet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
    }
    return cardSet;
  }, [rows, columns]);

  const createBoard = useCallback(() => {
    const cardSet = shuffleCards();
    const newBoard = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < columns; c++) {
        row.push({ card: cardSet.pop(), isFlipped: true, isMatched: false });
      }
      newBoard.push(row);
    }
    return newBoard;
  }, [rows, columns, shuffleCards]);

  const startNewGame = useCallback(() => {
    const newBoard = createBoard();
    setBoard(newBoard);
    setSelectedCards([]);
    setMatchedPairs(0);
    setErrors(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setPowerUp(null);
    setGameState("playing");
    setIsChecking(false);

    // Hide all cards after 2 seconds
    setTimeout(() => {
      setBoard((prevBoard) =>
        prevBoard.map((row) =>
          row.map((card) => ({ ...card, isFlipped: false }))
        )
      );
    }, 2000);
  }, [createBoard]);

  useEffect(() => {
    let timer;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameState("gameOver");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const selectCard = (r, c) => {
    if (gameState !== "playing" || isChecking) return;
    if (selectedCards.length === 2) return;
    if (board[r][c].isFlipped || board[r][c].isMatched) return;

    const newBoard = [...board];
    newBoard[r][c].isFlipped = true;
    setBoard(newBoard);

    setSelectedCards((prev) => [...prev, { r, c, card: newBoard[r][c].card }]);
  };

  useEffect(() => {
    if (selectedCards.length === 2) {
      setIsChecking(true);
      setTimeout(checkMatch, 1000);
    }
  }, [selectedCards]);

  const checkMatch = () => {
    const [card1, card2] = selectedCards;

    if (card1.card === card2.card) {
      const newBoard = [...board];
      newBoard[card1.r][card1.c].isMatched = true;
      newBoard[card2.r][card2.c].isMatched = true;
      setBoard(newBoard);
      setMatchedPairs((prev) => prev + 1);
      setCombo((prev) => prev + 1);
      const points = 100 * (combo + 1);
      setScore((prev) => prev + points);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (matchedPairs + 1 === (rows * columns) / 2) {
        setTimeout(() => {
          alert(`Congratulations! You completed level ${level}!`);
          levelUp();
        }, 500);
      }
    } else {
      setErrors((prev) => prev + 1);
      setCombo(0);
      const newBoard = [...board];
      newBoard[card1.r][card1.c].isFlipped = false;
      newBoard[card2.r][card2.c].isFlipped = false;
      setBoard(newBoard);
    }
    setSelectedCards([]);
    setIsChecking(false);
  };

  const levelUp = () => {
    setLevel((prev) => prev + 1);
    // Ensure we always have an even number of cards
    let newSize = Math.min(level + 2, 6); // Increment level size, but limit to 6x6 grid
    if (newSize % 2 !== 0) newSize--; // Ensure even size
    setRows(newSize);
    setColumns(newSize);
    setTimeLeft((prev) => prev + 30);
    activatePowerUp();
    startNewGame();
  };

  const activatePowerUp = () => {
    const powerUps = ["revealAll", "extraTime", "scoreBoost"];
    const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
    setPowerUp(randomPowerUp);

    switch (randomPowerUp) {
      case "revealAll":
        setBoard((prevBoard) =>
          prevBoard.map((row) =>
            row.map((card) => ({ ...card, isFlipped: true }))
          )
        );
        setTimeout(() => {
          setBoard((prevBoard) =>
            prevBoard.map((row) =>
              row.map((card) => ({ ...card, isFlipped: false }))
            )
          );
        }, 2000);
        break;
      case "extraTime":
        setTimeLeft((prev) => prev + 15);
        break;
      case "scoreBoost":
        setScore((prev) => prev * 2);
        break;
    }
  };

  return (
    <div className="text-center p-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <h1 className="text-4xl font-bold mb-4 text-white">
        Pokémon Memory Master
      </h1>
      <div className="mb-4 flex justify-between items-center">
        <span className="text-xl font-semibold text-white">Level: {level}</span>
        <span className="text-xl font-semibold text-white">Score: {score}</span>
        <span className="text-xl font-semibold text-white">
          Combo: x{combo}
        </span>
        <span className="text-xl font-semibold text-white">
          Errors: {errors}
        </span>
        <CountdownCircleTimer
          key={timeLeft} // Force re-render when timeLeft changes
          isPlaying={gameState === "playing"}
          duration={timeLeft}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          size={50}
          strokeWidth={5}
          onComplete={() => setGameState("gameOver")}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      </div>
      {powerUp && (
        <div className="mb-4 text-xl font-bold text-yellow-300">
          Power-Up Activated: {powerUp}!
        </div>
      )}
      {gameState === "gameOver" && (
        <div className="mb-4 text-2xl font-bold text-white">
          Game Over! Final Score: {score}
        </div>
      )}
      <motion.div
        className="grid gap-2 justify-center mb-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        {board.map((row, rIndex) =>
          row.map((cardObj, cIndex) => (
            <motion.div
              key={`${rIndex}-${cIndex}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.img
                src={
                  cardObj.isFlipped || cardObj.isMatched
                    ? imageMap[cardObj.card]
                    : Back
                }
                alt="Card"
                className="w-24 h-32 cursor-pointer rounded-lg shadow-lg"
                onClick={() => selectCard(rIndex, cIndex)}
                animate={{
                  rotateY: cardObj.isFlipped || cardObj.isMatched ? 180 : 0,
                }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          ))
        )}
      </motion.div>
      <button
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full shadow-lg transform transition hover:scale-105"
        onClick={startNewGame}
      >
        {gameState === "start" || gameState === "gameOver"
          ? "Start New Game"
          : "Restart Game"}
      </button>
    </div>
  );
};

export default MemoryGame;
