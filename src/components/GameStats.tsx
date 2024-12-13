import React from 'react';

interface GameStatsProps {
  score: number;
}

export function GameStats({ score }: GameStatsProps) {
  return (
    <div className="bg-gray-800 px-6 py-3 rounded-lg">
      <div className="text-2xl font-bold text-white">
        Score: {score}
      </div>
    </div>
  );
}