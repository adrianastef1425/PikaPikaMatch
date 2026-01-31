import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Card } from '../ui/Card';
import { cardTransition } from '../../utils/animations';
import type { Character } from '../../types';

interface CharacterCardProps {
  character: Character;
  onLike?: () => void;
  onDislike?: () => void;
  showVoteButtons?: boolean;
  isAnimating?: boolean;
  animationType?: 'like' | 'dislike' | null;
  transitionDirection?: 'left' | 'right' | null;
}

// Swipe threshold in pixels
const SWIPE_THRESHOLD = 100;
// Velocity threshold for quick swipes (pixels per second)
const VELOCITY_THRESHOLD = 500;

export const CharacterCard = memo(function CharacterCard({
  character,
  onLike: _onLike,
  onDislike: _onDislike,
  showVoteButtons: _showVoteButtons = false,
  isAnimating = false,
  animationType = null,
  transitionDirection = null,
}: CharacterCardProps) {
  const sourceColors = {
    pokemon: 'bg-pastel-yellow text-yellow-900',
    rickandmorty: 'bg-pastel-green text-green-900',
    superhero: 'bg-pastel-red text-red-900',
  };

  // Handle drag end to detect swipe gestures
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Check if swipe meets threshold or velocity requirements
    const isSwipeRight = offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD;
    const isSwipeLeft = offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD;
    
    // Trigger like on swipe right
    if (isSwipeRight && _onLike && !isAnimating) {
      _onLike();
    }
    // Trigger dislike on swipe left
    else if (isSwipeLeft && _onDislike && !isAnimating) {
      _onDislike();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Stacked card shadows - two layers behind main card */}
      <div className="absolute inset-0 bg-card-light dark:bg-card-dark rounded-lg transform translate-y-4 translate-x-2 opacity-30 -z-20 shadow-soft" />
      <div className="absolute inset-0 bg-card-light dark:bg-card-dark rounded-lg transform translate-y-2 translate-x-1 opacity-50 -z-10 shadow-soft" />
      
      {/* Main card with 4:5 aspect ratio */}
      <AnimatePresence mode="wait">
        <motion.div
          key={character.id}
          className="relative w-full"
          style={{ aspectRatio: '4/5' }}
          variants={transitionDirection ? cardTransition(transitionDirection) : undefined}
          initial={transitionDirection ? 'enter' : undefined}
          animate={transitionDirection ? 'enter' : undefined}
          exit={transitionDirection ? 'exit' : undefined}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          // Touch gesture support
          drag={!isAnimating ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          role="article"
          aria-label={`Character card for ${character.name}`}
        >
          <Card variant="default" className="h-full flex flex-col">
            {/* Image area - 75% of card height */}
            <div className="relative h-[75%] overflow-hidden">
              <motion.img
                src={character.imageUrl}
                alt={`${character.name} - ${character.source === 'rickandmorty' ? 'Rick & Morty' : character.source.charAt(0).toUpperCase() + character.source.slice(1)} character`}
                className="w-full h-full object-cover"
                loading="lazy"
                animate={
                  isAnimating && animationType === 'dislike'
                    ? {
                        filter: 'sepia(100%) saturate(300%) hue-rotate(-50deg)',
                      }
                    : {
                        filter: 'sepia(0%) saturate(100%) hue-rotate(0deg)',
                      }
                }
                transition={{ duration: 0.3 }}
              />
              
              {/* Dislike overlay */}
              {isAnimating && animationType === 'dislike' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-red-500/30"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  aria-hidden="true"
                >
                  <span className="material-symbols-outlined text-red-600 text-9xl font-bold" aria-hidden="true">
                    close
                  </span>
                </motion.div>
              )}
            </div>

            {/* Info area - 25% of card height */}
            <div className="h-[25%] p-2 sm:p-4 flex flex-col justify-between">
              <div className="flex-1">
                <h3 className="font-display font-bold text-base sm:text-lg mb-1 line-clamp-1">
                  {character.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {character.description}
                </p>
              </div>
              
              {/* Type tag */}
              <div className="mt-1 sm:mt-2">
                <span
                  className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
                    sourceColors[character.source]
                  }`}
                >
                  {character.source === 'rickandmorty' ? 'Rick & Morty' : character.source.charAt(0).toUpperCase() + character.source.slice(1)}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
