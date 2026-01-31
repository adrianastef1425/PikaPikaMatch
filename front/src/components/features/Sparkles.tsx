import { memo, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSparkles, likeAnimation, type Sparkle } from '../../utils/animations';

interface SparklesProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const Sparkles = memo(function Sparkles({ isActive, onComplete }: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (isActive) {
      setSparkles(generateSparkles(12));
      
      // Clear sparkles after animation completes
      const timer = setTimeout(() => {
        setSparkles([]);
        handleComplete();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, handleComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute text-4xl"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
            }}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: likeAnimation.sparkles.opacity,
              scale: likeAnimation.sparkles.scale,
              y: likeAnimation.sparkles.y,
            }}
            transition={{
              duration: 1.2,
              delay: sparkle.delay,
              ease: 'easeOut',
            }}
          >
            {sparkle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});
