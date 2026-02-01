import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CharacterCard } from '../components/features/CharacterCard';
import { Sparkles } from '../components/features/Sparkles';
import { Button } from '../components/ui/Button';
import { LoadingSpinner, ErrorMessage } from '../components/ui';
import { MainLayout } from '../components/layout';
import { useCharacters } from '../hooks/useCharacters';
import { useVoting } from '../hooks/useVoting';
import { useVotingContext } from '../context/VotingContext';
import { likeAnimation, dislikeAnimation } from '../utils/animations';

export function VotingView() {
  const { currentCharacter, isLoading, error } = useVotingContext();
  const { fetchRandomCharacter } = useCharacters();
  const { handleLike, handleDislike } = useVoting();
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<'like' | 'dislike' | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);

  // Fetch initial character on mount only if no character is loaded
  useEffect(() => {
    if (!currentCharacter && !isLoading) {
      console.log('[VotingView] No character loaded, fetching...');
      fetchRandomCharacter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  const handleLikeClick = async () => {
    if (isAnimating || !currentCharacter) return;

    setIsAnimating(true);
    setAnimationType('like');
    setShowSparkles(true);

    // Submit vote to API
    const success = await handleLike();

    if (success) {
      // Wait for like animation to complete
      setTimeout(() => {
        setShowSparkles(false);
        setTransitionDirection('right');
        
        // Wait for card exit animation, then fetch next character
        setTimeout(async () => {
          await fetchRandomCharacter();
          setTransitionDirection(null);
          setIsAnimating(false);
          setAnimationType(null);
        }, 400); // Wait for exit animation (300ms) + buffer
      }, 1000);
    } else {
      // Reset animation state if vote failed
      setIsAnimating(false);
      setAnimationType(null);
      setShowSparkles(false);
    }
  };

  const handleDislikeClick = async () => {
    if (isAnimating || !currentCharacter) return;

    setIsAnimating(true);
    setAnimationType('dislike');

    // Submit vote to API
    const success = await handleDislike();

    if (success) {
      // Wait for dislike animation to complete
      setTimeout(() => {
        setTransitionDirection('left');
        
        // Wait for card exit animation, then fetch next character
        setTimeout(async () => {
          await fetchRandomCharacter();
          setTransitionDirection(null);
          setIsAnimating(false);
          setAnimationType(null);
        }, 400); // Wait for exit animation (300ms) + buffer
      }, 800);
    } else {
      // Reset animation state if vote failed
      setIsAnimating(false);
      setAnimationType(null);
    }
  };

  // Loading state
  if (isLoading && !currentCharacter) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
          <LoadingSpinner message="Loading character..." />
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error && !currentCharacter) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
          <ErrorMessage 
            message={error}
            onRetry={() => fetchRandomCharacter()}
          />
        </div>
      </MainLayout>
    );
  }

  // No character available
  if (!currentCharacter) {
    return (
      <MainLayout>
        <motion.div 
          className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">No character available</p>
          </div>
        </motion.div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div 
        className="flex items-center justify-center p-2 sm:p-4 md:p-6 min-h-[calc(100vh-5rem)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        role="main"
        aria-label="Character voting interface"
      >
        {/* Sparkles overlay for like animation */}
        <Sparkles isActive={showSparkles} />

        {/* Mobile layout: card above, buttons below */}
        {/* Desktop layout: buttons on sides of card */}
        <div className="w-full max-w-md md:max-w-5xl lg:max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-8 lg:gap-16">
            {/* Desktop: Left dislike button */}
            <div className="hidden md:block">
              <motion.div
                animate={
                  isAnimating && animationType === 'dislike'
                    ? {
                        scale: dislikeAnimation.button.scale,
                        boxShadow: dislikeAnimation.button.boxShadow,
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                <Button
                  variant="dislike"
                  size="lg"
                  icon="close"
                  onClick={handleDislikeClick}
                  disabled={isAnimating}
                  aria-label="Dislike character"
                />
              </motion.div>
            </div>

            {/* Character Card */}
            <div className="mb-4 sm:mb-6 md:mb-0">
              {currentCharacter && (
                <CharacterCard
                  key={currentCharacter.id}
                  character={currentCharacter}
                  isAnimating={isAnimating}
                  animationType={animationType}
                  transitionDirection={transitionDirection}
                  onLike={handleLikeClick}
                  onDislike={handleDislikeClick}
                />
              )}
            </div>

            {/* Desktop: Right like button */}
            <div className="hidden md:block">
              <motion.div
                animate={
                  isAnimating && animationType === 'like'
                    ? {
                        scale: likeAnimation.button.scale,
                        boxShadow: likeAnimation.button.boxShadow,
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                <Button
                  variant="like"
                  size="lg"
                  icon="favorite"
                  onClick={handleLikeClick}
                  disabled={isAnimating}
                  aria-label="Like character"
                />
              </motion.div>
            </div>

            {/* Mobile: Buttons below card in horizontal layout */}
            <div className="md:hidden flex flex-row justify-center items-center gap-3 sm:gap-6 w-full px-2">
              <motion.div
                animate={
                  isAnimating && animationType === 'dislike'
                    ? {
                        scale: dislikeAnimation.button.scale,
                        boxShadow: dislikeAnimation.button.boxShadow,
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                <Button
                  variant="dislike"
                  size="md"
                  icon="close"
                  onClick={handleDislikeClick}
                  disabled={isAnimating}
                  aria-label="Dislike character"
                  className="sm:!px-8 sm:!py-4 sm:!text-lg"
                />
              </motion.div>
              
              <motion.div
                animate={
                  isAnimating && animationType === 'like'
                    ? {
                        scale: likeAnimation.button.scale,
                        boxShadow: likeAnimation.button.boxShadow,
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                <Button
                  variant="like"
                  size="md"
                  icon="favorite"
                  onClick={handleLikeClick}
                  disabled={isAnimating}
                  aria-label="Like character"
                  className="sm:!px-8 sm:!py-4 sm:!text-lg"
                />
              </motion.div>
            </div>
          </div>

          {/* Error message (if any) while character is displayed */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-center">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
}
