import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Card } from '../ui/Card';
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
  console.log('CharacterCard rendering:', character.name, 'transitionDirection:', transitionDirection);
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Reset image state when character changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    
    // Check if image is already cached/loaded
    const img = new Image();
    img.src = character.imageUrl;
    
    if (img.complete) {
      // Image is already loaded (cached)
      console.log('[CharacterCard] Image already cached:', character.name);
      setImageLoaded(true);
    }
  }, [character.id, character.imageUrl, character.name]);
  
  const sourceColors = {
    pokemon: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300',
    rickandmorty: 'bg-cyan-200 text-cyan-900 dark:bg-cyan-900/30 dark:text-cyan-300',
    superhero: 'bg-purple-200 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300',
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
    <div className="relative w-full max-w-[320px] sm:max-w-[400px] mx-auto">
      {/* Stacked card shadows - two layers behind main card */}
      <div className="absolute inset-0 bg-card-light dark:bg-card-dark rounded-lg transform translate-y-4 translate-x-2 opacity-30 -z-20 shadow-soft" />
      <div className="absolute inset-0 bg-card-light dark:bg-card-dark rounded-lg transform translate-y-2 translate-x-1 opacity-50 -z-10 shadow-soft" />
      
      {/* Main card with flexible height */}
      <AnimatePresence mode="wait">
        <motion.div
          key={character.id}
          className="relative w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={
            transitionDirection
              ? {
                  x: transitionDirection === 'left' ? -300 : 300,
                  opacity: 0,
                  rotate: transitionDirection === 'left' ? -10 : 10,
                }
              : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          // Touch gesture support
          drag={!isAnimating ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          role="article"
          aria-label={`Character card for ${character.name}`}
        >
          <Card variant="default" className="w-full flex flex-col">
            {/* Image area - fixed dimensions */}
            <div className="relative w-full h-[320px] sm:h-[400px] flex-shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-700">
              {/* Image skeleton/placeholder */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    aria-label="Loading image"
                  />
                </div>
              )}
              
              {/* Error placeholder */}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined text-6xl mb-2">broken_image</span>
                  <p className="text-sm">Image unavailable</p>
                </div>
              )}
              
              {/* Actual image */}
              <motion.img
                src={character.imageUrl}
                alt={`${character.name} - ${character.source === 'rickandmorty' ? 'Rick & Morty' : character.source.charAt(0).toUpperCase() + character.source.slice(1)} character`}
                className="w-full h-full object-cover"
                style={{ opacity: imageLoaded ? 1 : 0 }}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(false);
                }}
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

            {/* Info area - flexible height based on content */}
            <div className="p-3 sm:p-4 flex flex-col gap-2">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg mb-1">
                  {character.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {character.description}
                </p>
              </div>
              
              {/* Type tag */}
              <div>
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
