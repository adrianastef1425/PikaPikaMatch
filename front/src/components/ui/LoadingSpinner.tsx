import { memo } from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 border-2',
  md: 'h-12 w-12 border-4',
  lg: 'h-16 w-16 border-4',
};

export const LoadingSpinner = memo(function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md',
  className = '' 
}: LoadingSpinnerProps) {
  return (
    <motion.div 
      className={`text-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-live="polite"
    >
      <div 
        className={`inline-block animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]} mb-4`}
        aria-hidden="true"
      />
      {message && (
        <p className="text-gray-600 dark:text-gray-400" aria-label={message}>
          {message}
        </p>
      )}
    </motion.div>
  );
});
