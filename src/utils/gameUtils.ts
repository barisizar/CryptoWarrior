import { Position, Enemy } from '../types/game';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  PLAYER_SIZE, 
  ENEMY_SIZE,
  MAX_ENEMIES,
  MIN_ENEMY_SPEED,
  MAX_ENEMY_SPEED 
} from './gameConstants';

export function checkCollision(player: Position, enemy: Position): boolean {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const radiusSum = (PLAYER_SIZE + ENEMY_SIZE) / 2;
  return distance < radiusSum;
}

export function generateEnemies(count: number): Enemy[] {
  const enemies: Enemy[] = [];
  const sides = ['top', 'right', 'bottom', 'left'];
  
  for (let i = 0; i < count; i++) {
    const side = sides[Math.floor(Math.random() * sides.length)];
    enemies.push(createEnemy(side));
  }
  
  return enemies;
}

function createEnemy(side: string): Enemy {
  const speed = MIN_ENEMY_SPEED + Math.random() * (MAX_ENEMY_SPEED - MIN_ENEMY_SPEED);
  let position: Position;

  switch (side) {
    case 'top':
      position = { x: Math.random() * 100, y: -5 };
      break;
    case 'right':
      position = { x: 105, y: Math.random() * 100 };
      break;
    case 'bottom':
      position = { x: Math.random() * 100, y: 105 };
      break;
    default: // left
      position = { x: -5, y: Math.random() * 100 };
      break;
  }

  let direction = { x: 0, y: 0 };
  
  // Add randomness to direction while maintaining general inward movement
  const randomAngle = (Math.random() - 0.5) * Math.PI / 2; // ±45 degrees
  
  switch (side) {
    case 'top':
      direction = {
        x: Math.sin(randomAngle),
        y: Math.cos(randomAngle) // Mostly downward
      };
      break;
    case 'right':
      direction = {
        x: -Math.cos(randomAngle), // Mostly leftward
        y: Math.sin(randomAngle)
      };
      break;
    case 'bottom':
      direction = {
        x: Math.sin(randomAngle),
        y: -Math.cos(randomAngle) // Mostly upward
      };
      break;
    case 'left':
      direction = {
        x: Math.cos(randomAngle), // Mostly rightward
        y: Math.sin(randomAngle)
      };
      break;
  }

  // Normalize direction vector
  const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);

  return {
    id: Math.random().toString(36).substr(2, 9),
    position,
    direction: {
      x: direction.x / length,
      y: direction.y / length
    },
    speed
  };
}

export function isEnemyOffScreen(enemy: Enemy): boolean {
  const margin = 10;
  return (
    enemy.position.x < -margin ||
    enemy.position.x > 100 + margin ||
    enemy.position.y < -margin ||
    enemy.position.y > 100 + margin
  );
}

export function shouldSpawnEnemies(enemies: Enemy[]): boolean {
  return enemies.length < MAX_ENEMIES;
}