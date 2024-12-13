import React from 'react';
import { Heart, Sword, Shield } from 'lucide-react';
import { GameState } from '../../types/game';

interface GameStatsProps {
  gameState: GameState;
}

export function GameStats({ gameState }: GameStatsProps) {
  return (
    <div className="flex justify-between items-center mb-4 bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500 w-6 h-6" />
          <span className="text-lg font-bold">{gameState.health}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sword className="text-blue-500 w-6 h-6" />
          <span className="text-lg font-bold">{gameState.score.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="text-green-500 w-6 h-6" />
          <span className="text-lg font-bold">Level {gameState.level}</span>
        </div>
      </div>
    </div>
  );
}