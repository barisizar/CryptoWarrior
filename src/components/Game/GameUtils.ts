import { GameState } from '../../types/game';

export const calculateReward = (score: number): number => {
  return Math.floor(score / 100) * 0.01;
};

export const updateGameState = (currentState: GameState): GameState => {
  const newScore = currentState.score + 10;
  const newLevel = Math.floor(newScore / 100) + 1;
  
  return {
    ...currentState,
    score: newScore,
    level: newLevel,
    health: Math.max(0, currentState.health - (newLevel * 2)),
  };
};

export const checkGameOver = (state: GameState): boolean => {
  return state.health <= 0;
};