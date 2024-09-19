import React from 'react';
import { motion } from 'framer-motion';
import Back from "./assets/back.jpg";

const PokemonGameBoard = ({ board, columns, imageMap, selectCard }) => {
  return (
    <motion.div
      className="grid gap-4 justify-center mb-5"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, // Dynamic grid column count
        maxWidth: "100%", // Ensures it doesn't exceed the screen width
      }}
    >
      {board.map((row, rIndex) =>
        row.map((cardObj, cIndex) => (
          <motion.div
            key={`${rIndex}-${cIndex}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative flex items-center justify-center"
            style={{ paddingBottom: "100%" }} // Maintain square aspect ratio
          >
            <motion.img
              src={
                cardObj.isFlipped || cardObj.isMatched
                  ? imageMap[cardObj.card]
                  : Back
              }
              alt="Pokemon Card"
              className="absolute inset-0 w-full h-full object-cover cursor-pointer rounded-lg shadow-lg"
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
  );
};

export default PokemonGameBoard;
