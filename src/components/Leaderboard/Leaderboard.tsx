import React, { useEffect, useState } from 'react';
import { useGameContract } from '../../hooks/useGameContract';
import { formatAddress } from '../../utils/format';

interface LeaderboardEntry {
  address: string;
  score: number;
  timestamp: number;
}

export function Leaderboard() {
  const { getLeaderboard } = useGameContract();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        
        // Process the leaderboard data to remove duplicates
        const addressMap = new Map<string, LeaderboardEntry>();
        
        data.forEach((entry: LeaderboardEntry) => {
          const existingEntry = addressMap.get(entry.address);
          if (!existingEntry || existingEntry.score < entry.score) {
            addressMap.set(entry.address, entry);
          }
        });

        // Convert map back to array and sort by score
        const uniqueLeaderboard = Array.from(addressMap.values())
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // Keep top 10

        setLeaderboard(uniqueLeaderboard);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [getLeaderboard]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.address}
            className="flex justify-between items-center p-2 bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {index + 1}. {formatAddress(entry.address)}
              </span>
            </div>
            <span className="font-bold">{Math.floor(entry.score)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}