import { memo } from 'react';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  title?: string;
  className?: string;
}

export const ErrorMessage = memo(function ErrorMessage({ 
  message, 
  onRetry, 
  title = 'Oops!',
  className = '' 
}: ErrorMessageProps) {
  return (
    <motion.div 
      className={`text-center max-w-md mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      role="alert"
      aria-live="assertive"
    >
      <span className="material-symbols-outlined text-6xl text-red-500 mb-4 block" aria-hidden="true">
        error
      </span>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-primary text-gray-900 rounded-full font-semibold hover:scale-105 transition-transform active:scale-95"
          aria-label="Retry loading"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
});
