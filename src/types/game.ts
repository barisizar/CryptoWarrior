import { ethers } from 'ethers';

export interface Position {
  x: number;
  y: number;
}

export interface Enemy {
  id: string;
  position: Position;
  direction: Position;
  speed: number;
}

export interface GameState {
  health: number;
  score: number;
  level: number;
  isPlaying: boolean;
  player: Position;
  enemies: Enemy[];
}

export interface LeaderboardData {
  player: string;
  score: number;
  timestamp: number;
}

export interface WalletState {
  isConnected: boolean;
  error: string | null;
  address: string | null;
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
}