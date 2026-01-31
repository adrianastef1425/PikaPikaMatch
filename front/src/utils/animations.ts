import type { Variants } from 'framer-motion';

// Animation configuration for like button
export const likeAnimation = {
  button: {
    scale: [1, 1.2, 1],
    boxShadow: [
      '0 0 0 0 rgba(134, 239, 172, 0)',
      '0 0 25px 5px rgba(134, 239, 172, 0.6)',
      '0 0 0 0 rgba(134, 239, 172, 0)'
    ]
  },
  sparkles: {
    opacity: [0, 1, 0],
    scale: [0, 1, 1.5],
    y: [0, -50, -100]
  }
};

// Animation configuration for dislike button
export const dislikeAnimation = {
  button: {
    scale: [1, 0.95, 1],
    boxShadow: [
      '0 0 0 0 rgba(239, 68, 68, 0)',
      '0 0 20px 4px rgba(239, 68, 68, 0.4)',
      '0 0 0 0 rgba(239, 68, 68, 0)'
    ]
  },
  image: {
    filter: [
      'sepia(0%) saturate(100%) hue-rotate(0deg)',
      'sepia(100%) saturate(300%) hue-rotate(-50deg)'
    ]
  },
  overlay: {
    opacity: [0, 0.3],
    scale: [0.5, 1]
  }
};

// Card transition animation variants
export const cardTransition = (direction: 'left' | 'right'): Variants => ({
  exit: {
    x: direction === 'left' ? -300 : 300,
    opacity: 0,
    rotate: direction === 'left' ? -10 : 10,
    transition: { duration: 0.3 }
  },
  enter: {
    x: 0,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.3 }
  }
});

// Button interaction animations
export const buttonInteraction = {
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};

// Sparkle emoji options for like animation
const SPARKLE_EMOJIS = ['✨', '💫', '⭐', '🌟', '💖', '💚', '💛'];

// Generate random sparkle positions across the screen
export interface Sparkle {
  id: string;
  emoji: string;
  x: number;
  y: number;
  delay: number;
}

export function generateSparkles(count: number = 12): Sparkle[] {
  const sparkles: Sparkle[] = [];
  
  for (let i = 0; i < count; i++) {
    sparkles.push({
      id: `sparkle-${i}-${Date.now()}`,
      emoji: SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)],
      x: Math.random() * 100, // 0-100% of viewport width
      y: Math.random() * 100, // 0-100% of viewport height
      delay: Math.random() * 0.2, // Stagger animation start
    });
  }
  
  return sparkles;
}
