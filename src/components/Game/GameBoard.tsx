import React from 'react';
import { GameState } from '../../types/game';

interface GameBoardProps {
  gameState: GameState;
  onMouseMove: (x: number, y: number) => void;
  onStart: () => void;
  balance: string;
  canPlay: boolean;
}

export function GameBoard({ gameState, onMouseMove, onStart, balance, canPlay }: GameBoardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onMouseMove(x, y);
  };

  return (
    <div 
      className="relative w-full h-[600px] bg-gray-800 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {!gameState.isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={onStart}
            className={`
              bg-purple-600 hover:bg-purple-700 
              text-white font-bold py-3 px-6 
              rounded-lg text-xl transition-colors
              ${!canPlay ? 'opacity-90' : 'opacity-100'}
            `}
          >
            {canPlay ? 'Start Game' : 'Deposit to Play'}
          </button>
        </div>
      )}
      
      {gameState.isPlaying && (
        <>
          <div
            className="absolute w-12 h-12 bg-purple-500 rounded-full transition-all duration-100"
            style={{ 
              left: `${gameState.player.x}%`, 
              top: `${gameState.player.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
          
          {gameState.enemies.map((enemy) => (
            <div
              key={enemy.id}
              className="absolute w-8 h-8 bg-red-500 rounded-full"
              style={{
                left: `${enemy.position.x}%`,
                top: `${enemy.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}