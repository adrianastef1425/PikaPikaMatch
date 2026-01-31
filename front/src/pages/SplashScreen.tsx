import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/vote');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-pastel-yellow to-pastel-pink dark:from-background-dark dark:via-gray-800 dark:to-gray-900 font-display flex items-center justify-center overflow-hidden relative" role="main">
      {/* Decorative sparkles and stars */}
      <motion.div
        className="absolute top-10 left-10 text-6xl opacity-30"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        aria-hidden="true"
      >
        ✨
      </motion.div>

      <motion.div
        className="absolute top-20 right-20 text-5xl opacity-25"
        initial={{ opacity: 0, scale: 0, rotate: 180 }}
        animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        aria-hidden="true"
      >
        ⭐
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 text-5xl opacity-25"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        aria-hidden="true"
      >
        ⭐
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10 text-6xl opacity-30"
        initial={{ opacity: 0, scale: 0, rotate: 180 }}
        animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        aria-hidden="true"
      >
        ✨
      </motion.div>

      <motion.div
        className="absolute top-1/3 left-1/4 text-4xl opacity-20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        aria-hidden="true"
      >
        💫
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-1/4 text-4xl opacity-20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        aria-hidden="true"
      >
        💫
      </motion.div>

      {/* Main content */}
      <div className="text-center z-10 px-4">
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-primary mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          PikaPikaMatch
        </motion.h1>

        <motion.p
          className="text-2xl md:text-3xl font-semibold text-secondary tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          SPARKLE EVERY DAY
        </motion.p>

        {/* Pulsing sparkle effect */}
        <motion.div
          className="mt-8 text-5xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          aria-hidden="true"
        >
          ✨
        </motion.div>
      </div>
    </div>
  );
}
