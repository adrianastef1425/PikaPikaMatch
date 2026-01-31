import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { likeAnimation, dislikeAnimation } from '../../utils/animations';

interface VoteButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  disabled?: boolean;
  layout?: 'horizontal' | 'sides';
  isAnimating?: boolean;
  animationType?: 'like' | 'dislike' | null;
}

export const VoteButtons = memo(function VoteButtons({
  onLike,
  onDislike,
  disabled = false,
  layout = 'horizontal',
  isAnimating = false,
  animationType = null,
}: VoteButtonsProps) {
  const layoutStyles = useMemo(() => ({
    horizontal: 'flex flex-row justify-center items-center gap-6 w-full',
    sides: 'flex flex-row justify-between items-center w-full',
  }), []);

  return (
    <div className={layoutStyles[layout]}>
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
          onClick={onDislike}
          disabled={disabled}
          aria-label="Dislike character"
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
          size="lg"
          icon="favorite"
          onClick={onLike}
          disabled={disabled}
          aria-label="Like character"
        />
      </motion.div>
    </div>
  );
});
