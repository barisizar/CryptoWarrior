import React, { useState, useEffect } from 'react';
import { GameStats } from './GameStats';
import { Leaderboard } from './Leaderboard';
import { DepositModal } from './DepositModal';
import { useGameControls } from '../hooks/useGameControls';
import { useGameContract } from '../hooks/useGameContract';
import { GameState, Position } from '../types/game';

export function Game() {
  const [gameState, setGameState] = useState<GameState>({
    health: 100,
    score: 0,
    level: 1,
    isPlaying: false,
  });
  const { initContract, getPlayerBalance, submitScore } = useGameContract();
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [showDepositModal, setShowDepositModal] = useState(false);
  const { initContract, getBalance, submitScore, error } = useGameContract();
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize contract and fetch initial balance
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        await initContract();
        const bal = await getBalance();
        setBalance(bal);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, [initContract, getBalance]);

  // Refresh balance periodically and after modal closes
useEffect(() => {
    const fetchBalance = async () => {
              console.log("HERE1")

      const bal = await getPlayerBalance();
      console.log('Player balance:', bal);
      setBalance(bal);
    };
    fetchBalance();
  }, [getPlayerBalance]);

  useGameControls(gameState.isPlaying, setPosition);

const startGame = async () => {
    const playerBalance = await getPlayerBalance();
    if (Number(playerBalance) === 0) {
      setShowDepositModal(true);
      return;
    }
    setGameState(prev => ({ ...prev, isPlaying: true }));
  };

  const handleGameOver = async () => {
    try {
      await submitScore(gameState.score);
      // Refresh balance after submitting score
      const newBalance = await getBalance();
      setBalance(newBalance);
    } catch (err) {
      console.error('Failed to submit score:', err);
    } finally {
      setGameState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const handleDepositModalClose = async () => {
    setShowDepositModal(false);
    // Refresh balance after deposit modal closes
    const newBalance = await getBalance();
    setBalance(newBalance);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading game...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <GameStats gameState={gameState} balance={balance} />
        <div className="relative w-full h-[600px] bg-gray-800 rounded-lg overflow-hidden">
          {!gameState.isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
                disabled={Number(balance) === 0}
              >
                {Number(balance) === 0 ? 'Deposit to Play' : 'Start Game'}
              </button>
            </div>
          ) : (
            <div
              className="absolute w-12 h-12 bg-purple-500 rounded-full transition-all duration-100"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            />
          )}
        </div>
      </div>
      <div>
        <Leaderboard />
      </div>
      <DepositModal
        isOpen={showDepositModal}
        onClose={handleDepositModalClose}
      />
    </div>
  );
}