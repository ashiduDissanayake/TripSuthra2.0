import React from "react";
import { motion } from "framer-motion";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Zap, Star, AlertTriangle, Trophy } from "lucide-react";

const PokemonGameStatus = ({
  gameState,
  level,
  score,
  combo,
  errors,
  timeLeft,
  setGameState,
}) => {
  if (gameState !== "playing") return null;

  return (
    <motion.div
      className="m-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg border-4 border-yellow-400"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between gap-7 items-center">
        <StatusItem
          icon={<Trophy size={24} />}
          label="Level"
          value={level}
          color="text-yellow-300"
        />
        <StatusItem
          icon={<Star size={24} />}
          label="Score"
          value={score}
          color="text-green-300"
        />
        <StatusItem
          icon={<Zap size={24} />}
          label="Combo"
          value={`x${combo}`}
          color="text-blue-300"
        />
        <StatusItem
          icon={<AlertTriangle size={24} />}
          label="Errors"
          value={errors}
          color="text-red-300"
        />

        <div className="relative flex items-center justify-center">
          <CountdownCircleTimer
            key={timeLeft}
            isPlaying={gameState === "playing"}
            duration={timeLeft}
            colors={[["#00ff00", 0.33], ["#ffff00", 0.33], ["#ff0000"]]}
            size={60}
            strokeWidth={6}
            onComplete={() => setGameState("gameOver")}
          >
            {({ remainingTime }) => (
              <div className="text-xl font-bold text-white">
                {remainingTime}
              </div>
            )}
          </CountdownCircleTimer>
          <motion.div
            className="absolute inset-0 border-4 border-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="w-10 h-10 rounded-full bg-red-500 opacity-75" />
          </motion.div>
        </div>
      </div>

      {/* Pokemon-style experience bar */}
      <div className="mt-3 bg-gray-700 rounded-full h-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: `${(score / (level * 100)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

const StatusItem = ({ icon, label, value, color }) => (
  <motion.div
    className="flex flex-col items-center"
    whileHover={{ scale: 1.1 }}
  >
    <div className={`text-2xl font-bold ${color}`}>{icon}</div>
    <div className="text-sm text-white">{label}</div>
    <div className={`text-xl font-bold ${color}`}>{value}</div>
  </motion.div>
);

export default PokemonGameStatus;
