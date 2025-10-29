import { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import Game from '@/components/Game';

const Index = () => {
  const [gameState, setGameState] = useState<'welcome' | 'playing'>('welcome');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const handleStartGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setGameState('playing');
  };

  const handleBackToWelcome = () => {
    setGameState('welcome');
  };

  return (
    <>
      {gameState === 'welcome' && (
        <WelcomeScreen onStartGame={handleStartGame} />
      )}
      {gameState === 'playing' && (
        <Game difficulty={difficulty} onBack={handleBackToWelcome} />
      )}
    </>
  );
};

export default Index;
