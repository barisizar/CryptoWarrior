import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useGameContract } from '../hooks/useGameContract';

interface LeaderboardEntry {
  player: string;
  score: number;
  timestamp: number;
}

export function Leaderboard() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const { getLeaderboard } = useGameContract();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const leaderboardData = await getLeaderboard(10);
      setScores(leaderboardData);
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [getLeaderboard]);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-500" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>
      <div className="space-y-2">
        {scores.map((entry, index) => (
          <div
            key={`${entry.player}-${entry.timestamp}`}
            className="flex items-center justify-between p-2 bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400">#{index + 1}</span>
              <span className="text-sm font-mono">
                {entry.player.slice(0, 6)}...{entry.player.slice(-4)}
              </span>
            </div>
            <span className="font-bold text-purple-400">{entry.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}