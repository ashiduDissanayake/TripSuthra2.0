import React, { useState } from "react";
import { motion } from "framer-motion";

const PokemonStartButton = ({ onClick, gameState }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const buttonText =
    gameState === "start" || gameState === "gameOver"
      ? "Start New Game"
      : "Restart Game";

  return (
    <motion.button
      className="relative bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-xl border-4 border-yellow-400 overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsPressed(true)}
      onTapEnd={() => setIsPressed(false)}
      onClick={onClick}
    >
      {/* Pokéball Effect */}
      <span className="absolute inset-0 z-0 flex items-center justify-center">
        <motion.svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          initial={{ rotate: 0 }}
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 2, ease: "linear", repeat: Infinity }}
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="#ffffff"
            stroke="#000"
            strokeWidth="4"
          />
          <path d="M2 50h96" stroke="#000" strokeWidth="4" />
          <circle
            cx="50"
            cy="50"
            r="16"
            fill="#ffffff"
            stroke="#000"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="12"
            fill={isPressed ? "#ff0000" : "#ffffff"}
          />
        </motion.svg>
      </span>

      {/* Button Text */}
      <motion.span
        className="relative z-10 text-2xl  font-extrabold leading-tight text-outline"
        animate={{ y: isPressed ? 2 : 0 }}
      >
        {buttonText}
      </motion.span>

      {/* Pikachu Tail */}
      <motion.span
        className="absolute -right-4 -bottom-4 w-12 h-12 bg-yellow-400 rounded-tl-full z-20"
        initial={{ rotate: 0 }}
        animate={{ rotate: isHovered ? [0, 15, -15, 0] : 0 }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />

      {/* Poké Ball Opening Effect */}
      <motion.span
        className="absolute inset-0 bg-white z-0"
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: isPressed ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Sparkle Effects */}
      {isHovered && (
        <>
          <motion.span
            className="absolute top-0 left-0 w-2 h-2 bg-yellow-300 rounded-full z-30"
            animate={{
              x: [0, 10, 0],
              y: [0, -10, 0],
              opacity: [1, 0, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.span
            className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-300 rounded-full z-30"
            animate={{
              x: [0, -10, 0],
              y: [0, 10, 0],
              opacity: [1, 0, 1],
            }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}
    </motion.button>
  );
};

export default PokemonStartButton;
