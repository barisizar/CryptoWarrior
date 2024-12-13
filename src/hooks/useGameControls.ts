import { useEffect, useCallback } from 'react';
import { Position } from '../types/game';

export function useGameControls(
  isPlaying: boolean,
  setPosition: React.Dispatch<React.SetStateAction<Position>>
) {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const moveAmount = 10;
      switch (e.key) {
        case 'ArrowUp':
          setPosition(prev => ({ ...prev, y: Math.max(0, prev.y - moveAmount) }));
          break;
        case 'ArrowDown':
          setPosition(prev => ({ ...prev, y: Math.min(90, prev.y + moveAmount) }));
          break;
        case 'ArrowLeft':
          setPosition(prev => ({ ...prev, x: Math.max(0, prev.x - moveAmount) }));
          break;
        case 'ArrowRight':
          setPosition(prev => ({ ...prev, x: Math.min(90, prev.x + moveAmount) }));
          break;
      }
    },
    [isPlaying, setPosition]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}