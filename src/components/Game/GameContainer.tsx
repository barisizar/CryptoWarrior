import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { GameStats } from './GameStats';
import { Leaderboard } from '../Leaderboard/Leaderboard';
import { DepositModal } from '../Wallet/DepositModal';
import { useGameContract } from '../../hooks/useGameContract';
import { GameState } from '../../types/game';
import { 
  generateEnemies,
  checkCollision, 
  isEnemyOffScreen,
  shouldSpawnEnemies
} from '../../utils/gameUtils';
import { 
  SCORE_INCREMENT, 
  SPAWN_INTERVAL,
  MAX_ENEMIES
} from '../../utils/gameConstants';

const initialGameState: GameState = {
  health: 100,
  score: 0,
  level: 1,
  isPlaying: false,
  player: { x: 50, y: 50 },
  enemies: []
};

export function GameContainer() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const { initContract, getPlayerBalance, submitScore } = useGameContract();
  const [balance, setBalance] = useState('0');
  const [canPlay, setCanPlay] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSpawnTime, setLastSpawnTime] = useState(0);

  // Contract initialization and balance polling
  useEffect(() => {
    let mounted = true;
    let balanceInterval: NodeJS.Timer;

    const initialize = async () => {
      if (!mounted || isInitialized) return;
      
      try {
        await initContract();
        setIsInitialized(true);

        const bal = await getPlayerBalance();
        if (mounted) {
          setBalance(bal);
          setCanPlay(Number(bal) > 0);
        }

        balanceInterval = setInterval(async () => {
          if (mounted) {
            const newBal = await getPlayerBalance();
            if (mounted) {
              setBalance(newBal);
              setCanPlay(Number(newBal) > 0);
            }
          }
        }, 5000);
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };

    initialize();

    return () => {
      mounted = false;
      if (balanceInterval) {
        clearInterval(balanceInterval);
      }
    };
  }, [initContract, getPlayerBalance, isInitialized]);

  // Separate spawning effect
  useEffect(() => {
    if (!gameState.isPlaying) return;

    // Initial spawn
    setGameState(prev => ({
      ...prev,
      enemies: generateEnemies(6)
    }));

    const spawnInterval = setInterval(() => {
      setGameState(prev => {
        if (prev.enemies.length < MAX_ENEMIES) {
          const newEnemies = generateEnemies(2);
          return {
            ...prev,
            enemies: [...prev.enemies, ...newEnemies]
          };
        }
        return prev;
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(spawnInterval);
  }, [gameState.isPlaying]);

  // Game loop for movement and collisions
  useEffect(() => {
    if (!gameState.isPlaying) return;

    let animationFrameId: number;
    let lastTimestamp = 0;

    const gameLoop = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      setGameState(prev => {
        // Update enemy positions
        const updatedEnemies = prev.enemies
          .map(enemy => ({
            ...enemy,
            position: {
              x: enemy.position.x + enemy.direction.x * enemy.speed,
              y: enemy.position.y + enemy.direction.y * enemy.speed
            }
          }))
          .filter(enemy => !isEnemyOffScreen(enemy));

        // Check for collisions
        for (const enemy of updatedEnemies) {
          if (checkCollision(prev.player, enemy.position)) {
            cancelAnimationFrame(animationFrameId);
            handleGameOver();
            return {
              ...initialGameState,
              isPlaying: false
            };
          }
        }

        return {
          ...prev,
          enemies: updatedEnemies,
          score: prev.score + SCORE_INCREMENT,
          level: Math.floor(prev.score / 100) + 1
        };
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameState.isPlaying]);

  const handleMouseMove = useCallback((x: number, y: number) => {
    if (!gameState.isPlaying) return;
    setGameState(prev => ({
      ...prev,
      player: { x, y }
    }));
  }, [gameState.isPlaying]);

  const startGame = async () => {
    if (!canPlay) {
      setShowDepositModal(true);
      return;
    }
    setGameState({
      ...initialGameState,
      isPlaying: true
    });
    setLastSpawnTime(0);
  };

  const handleGameOver = async () => {
    try {
      await submitScore(Math.floor(gameState.score));
      const newBal = await getPlayerBalance();
      setBalance(newBal);
      setCanPlay(Number(newBal) > 0);
    } catch (error) {
      console.error('Game over handling failed:', error);
    } finally {
      setGameState({
        ...initialGameState,
        isPlaying: false
      });
    }
  };

  const handleDepositModalClose = async () => {
    try {
      const bal = await getPlayerBalance();
      setBalance(bal);
      setCanPlay(Number(bal) > 0);
    } catch (error) {
      console.error('Failed to update balance:', error);
    } finally {
      setShowDepositModal(false);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <GameStats gameState={gameState} />
        <GameBoard
          gameState={gameState}
          onMouseMove={handleMouseMove}
          onStart={startGame}
          balance={balance}
          canPlay={canPlay}
        />
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