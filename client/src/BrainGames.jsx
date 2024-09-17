import React, { useState, useEffect } from 'react';
import { Shuffle, Eye, Zap, Brain } from 'lucide-react';

const games = [
  { name: 'Memory Match', icon: <Eye /> },
  { name: 'Pattern Predictor', icon: <Shuffle /> },
  { name: 'Quick Math', icon: <Zap /> },
  { name: 'Word Scramble', icon: <Brain /> },
];

const MemoryMatch = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(shuffled);
  }, []);

  const handleClick = (id) => {
    if (flipped.length === 2) return;
    if (solved.includes(id)) return;

    setFlipped([...flipped, id]);
    setMoves(moves + 1);

    if (flipped.length === 1) {
      const firstCard = cards.find(card => card.id === flipped[0]);
      const secondCard = cards.find(card => card.id === id);

      if (firstCard.emoji === secondCard.emoji) {
        setSolved([...solved, flipped[0], id]);
      }

      setTimeout(() => setFlipped([]), 1000);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Memory Match</h2>
      <p className="mb-2">Moves: {moves}</p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <button
            key={card.id}
            className={`w-16 h-16 text-3xl flex items-center justify-center rounded ${
              flipped.includes(card.id) || solved.includes(card.id) ? 'bg-blue-200' : 'bg-gray-200'
            }`}
            onClick={() => handleClick(card.id)}
          >
            {flipped.includes(card.id) || solved.includes(card.id) ? card.emoji : '?'}
          </button>
        ))}
      </div>
    </div>
  );
};

const PatternPredictor = () => {
  const [pattern, setPattern] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    generatePattern();
  }, []);

  const generatePattern = () => {
    const newPattern = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
    setPattern(newPattern);
    setUserInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextNumber = pattern[pattern.length - 1] + (pattern[1] - pattern[0]);
    if (parseInt(userInput) === nextNumber) {
      setScore(score + 1);
    }
    generatePattern();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pattern Predictor</h2>
      <p className="mb-2">Score: {score}</p>
      <div className="flex space-x-2 mb-4">
        {pattern.map((num, index) => (
          <div key={index} className="w-8 h-8 bg-blue-200 flex items-center justify-center rounded">
            {num}
          </div>
        ))}
        <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded">?</div>
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="number"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border rounded px-2 py-1"
          placeholder="Next number"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

const QuickMath = () => {
  const [problem, setProblem] = useState({ num1: 0, num2: 0, operator: '+' });
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    generateProblem();
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    setProblem({ num1, num2, operator });
    setUserAnswer('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correctAnswer;
    switch (problem.operator) {
      case '+': correctAnswer = problem.num1 + problem.num2; break;
      case '-': correctAnswer = problem.num1 - problem.num2; break;
      case '*': correctAnswer = problem.num1 * problem.num2; break;
      default: correctAnswer = 0;
    }
    if (parseInt(userAnswer) === correctAnswer) {
      setScore(score + 1);
    }
    generateProblem();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quick Math</h2>
      <p className="mb-2">Score: {score} | Time: {timeLeft}s</p>
      <div className="text-2xl mb-4">
        {problem.num1} {problem.operator} {problem.num2} = ?
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="border rounded px-2 py-1"
          placeholder="Your answer"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

const WordScramble = () => {
  const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew'];
  const [scrambledWord, setScrambledWord] = useState('');
  const [originalWord, setOriginalWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    newWord();
  }, []);

  const scrambleWord = (word) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const newWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setOriginalWord(word);
    setScrambledWord(scrambleWord(word));
    setUserGuess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userGuess.toLowerCase() === originalWord) {
      setScore(score + 1);
    }
    newWord();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Word Scramble</h2>
      <p className="mb-2">Score: {score}</p>
      <div className="text-2xl mb-4">
        Unscramble: {scrambledWord}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          className="border rounded px-2 py-1"
          placeholder="Your guess"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

const BrainGames = () => {
  const [currentGame, setCurrentGame] = useState('Memory Match');

  const renderGame = () => {
    switch (currentGame) {
      case 'Memory Match': return <MemoryMatch />;
      case 'Pattern Predictor': return <PatternPredictor />;
      case 'Quick Math': return <QuickMath />;
      case 'Word Scramble': return <WordScramble />;
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Brain Games for Kids</h1>
      <div className="flex justify-center space-x-4 mb-6">
        {games.map(game => (
          <button
            key={game.name}
            onClick={() => setCurrentGame(game.name)}
            className={`flex items-center px-3 py-2 rounded ${
              currentGame === game.name ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {game.icon}
            <span className="ml-2">{game.name}</span>
          </button>
        ))}
      </div>
      {renderGame()}
    </div>
  );
};

export default BrainGames;