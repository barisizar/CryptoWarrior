import React from 'react';
import { Trophy } from 'lucide-react';

interface LeaderboardEntryProps {
  player: string;
  score: number;
  index: number;
}

export function LeaderboardEntry({ player, score, index }: LeaderboardEntryProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">#{index + 1}</span>
        <span className="text-sm font-mono">
          {player.slice(0, 6)}...{player.slice(-4)}
        </span>
      </div>
      <span className="font-bold text-purple-400">{score}</span>
    </div>
  );
}