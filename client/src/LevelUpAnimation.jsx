import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Trophy } from "lucide-react";

const LevelUpAnimation = ({ level, onComplete }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete();
    }, 3000); // Show the animation for 3 seconds
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="p-8 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow-lg border-4 border-yellow-400"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="text-6xl text-yellow-300"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Trophy size={72} />
          </motion.div>
          <motion.h2
            className="text-4xl font-bold"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Level {level} Complete!
          </motion.h2>
          <motion.div
            className="flex gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Star size={40} className="text-yellow-300" />
            <Star size={40} className="text-yellow-300" />
            <Star size={40} className="text-yellow-300" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LevelUpAnimation;
