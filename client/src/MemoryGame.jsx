import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import confetti from "canvas-confetti";

// Import images (assuming these imports work in your project structure)
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
import Background from "./assets/background.png";
import Topic from "./assets/topic.png";
import PokemonStartButton from "./PokemonStartButton";
import PokemonGameStatus from "./PokemonGameStatus";
import PokemonGameBoard from "./PokemonGameBoard";
import LevelUpAnimation from "./LevelUpAnimation";

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
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Function to handle the level completion logic
  const checkForLevelCompletion = () => {
    if (matchedPairs + 1 === (rows * columns) / 2) {
      setShowLevelUp(true); // Show the level-up animation
      setTimeout(() => {
        setShowLevelUp(false); // Hide animation after 3 seconds
        levelUp(); // Proceed to the next level
      }, 3000); // Animation duration is 3 seconds
    }
  };

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
      {
        checkForLevelCompletion();
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
    <div className="text-center p-4 ">
      <img
        src={Background}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      />
      {gameState === "start" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }} // Start from invisible and smaller size
          animate={{ opacity: 1, scale: 0.8 }} // Transition to visible and normal size
          transition={{
            duration: 1, // Duration of the animation in seconds
            ease: "easeInOut", // Easing function for smooth transition
          }}
        >
          <img src={Topic} alt="topic" className="w-full h-auto" />
        </motion.div>
      )}

      <PokemonGameStatus
        gameState={gameState}
        level={level}
        score={score}
        combo={combo}
        errors={errors}
        timeLeft={timeLeft}
        setGameState={setGameState}
      />

      {powerUp && (
        <motion.div
          className="mb-4 p-4 text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl shadow-lg border-4 border-yellow-300"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
        >
          Power-Up Activated: {powerUp}!
        </motion.div>
      )}

      {gameState === "gameOver" && (
        <motion.div
          className="mb-4 p-4 text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-xl shadow-lg border-4 border-red-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
        >
          Game Over! Final Score: {score}
        </motion.div>
      )}

      {showLevelUp && (
        <LevelUpAnimation
          level={level}
          onComplete={() => setShowLevelUp(false)}
        />
      )}

      <PokemonGameBoard
        board={board}
        columns={columns}
        imageMap={imageMap}
        selectCard={selectCard}
      />

      <PokemonStartButton onClick={startNewGame} gameState={gameState} />
    </div>
  );
};

export default MemoryGame;
