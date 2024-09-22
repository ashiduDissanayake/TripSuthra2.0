import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import { Loader2, Sun, Moon } from 'lucide-react';

// RotatingSphere component integrated directly
const RotatingSphere = () => {
  const meshRef = useRef();
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <meshPhongMaterial color="#ff69b4" shininess={100} />
    </Sphere>
  );
};

// ParticleBackground component
const ParticleBackground = () => {
  const { viewport } = useThree();
  const particlesRef = useRef([]);

  useEffect(() => {
    particlesRef.current = Array(100).fill().map(() => ({
      x: Math.random() * viewport.width - viewport.width / 2,
      y: Math.random() * viewport.height - viewport.height / 2,
      z: Math.random() * -10,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
    }));
  }, [viewport]);

  useFrame(() => {
    particlesRef.current.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -viewport.width / 2 || particle.x > viewport.width / 2) particle.vx *= -1;
      if (particle.y < -viewport.height / 2 || particle.y > viewport.height / 2) particle.vy *= -1;
    });
  });

  return (
    <instancedMesh args={[null, null, 100]}>
      <sphereGeometry args={[0.02, 32, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      {particlesRef.current.map((particle, i) => (
        <instance key={i} position={[particle.x, particle.y, particle.z]} />
      ))}
    </instancedMesh>
  );
};

const WelcomeScreen = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [theme, setTheme] = useState('dark');

  const fadeIn = useSpring({
    opacity: showMenu ? 1 : 0,
    config: { ...config.molasses, duration: 1000 },
  });

  const floatAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: { transform: 'translateY(-10px)' },
    config: { duration: 1500, easing: t => t * (2 - t) },
    loop: { reverse: true },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMenu(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const games = [
    { id: 1, name: 'Math Challenge', color: '#4CAF50', description: 'Test your math skills with challenging puzzles!' },
    { id: 2, name: 'Word Puzzle', color: '#2196F3', description: 'Expand your vocabulary with our word games!' },
    { id: 3, name: 'Memory Match', color: '#FFC107', description: 'Train your memory with our matching game!' },
  ];

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`h-screen w-screen flex justify-center items-center transition-colors duration-500 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-blue-900' : 'bg-gradient-to-br from-blue-100 to-white'}`}>
      <animated.div style={fadeIn} className="text-center px-4 sm:px-0">
        <h1 className={`text-4xl sm:text-6xl font-bold mb-8 tracking-wider transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Welcome to the Game Zone!
        </h1>
        
        {!showMenu ? (
          <div className="flex flex-col items-center">
            <Loader2 className={`w-12 h-12 sm:w-16 sm:h-16 animate-spin transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} />
            <p className={`text-xl sm:text-2xl mt-4 transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Loading adventures...</p>
          </div>
        ) : (
          <>
            <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-8">
              <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <RotatingSphere />
                <Text
                  position={[0, 0, 1.2]}
                  color={theme === 'dark' ? 'white' : 'black'}
                  fontSize={0.2}
                  maxWidth={2}
                  textAlign="center"
                >
                  Choose Your Game!
                </Text>
                <ParticleBackground />
              </Canvas>
            </div>
            <div className="flex flex-col space-y-4 items-center">
              {games.map((game) => (
                <animated.button
                  key={game.id}
                  style={floatAnimation}
                  className={`w-64 py-3 px-6 text-xl font-semibold text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 hover:scale-105`}
                  style={{
                    ...floatAnimation,
                    background: `linear-gradient(45deg, ${game.color}, ${game.color}CC)`,
                    boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)`,
                  }}
                  onClick={() => handleGameClick(game)}
                  aria-label={`Play ${game.name}`}
                >
                  {game.name}
                </animated.button>
              ))}
            </div>
          </>
        )}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-300"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </animated.div>
      {selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`bg-white dark:bg-gray-800 p-8 rounded-lg text-center transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            <h2 className="text-3xl font-bold mb-4">{selectedGame.name}</h2>
            <p className="mb-4">{selectedGame.description}</p>
            <p className="mb-4">Game loading... Get ready for the challenge!</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              onClick={() => setSelectedGame(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;