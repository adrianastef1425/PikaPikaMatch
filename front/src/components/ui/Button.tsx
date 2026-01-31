import { memo } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'like' | 'dislike' | 'icon' | 'default';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const Button = memo(function Button({
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  children,
  disabled = false,
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
}: ButtonProps) {
  const baseStyles = 'rounded-full font-display font-semibold transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantStyles = {
    like: 'bg-pastel-green text-green-900 hover:shadow-glow-green',
    dislike: 'bg-pastel-red text-red-900 hover:shadow-glow-red',
    icon: 'bg-white/80 text-gray-700 hover:bg-white',
    default: 'bg-primary text-yellow-900 hover:bg-yellow-300',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;

  return (
    <motion.button
      type={type}
      className={combinedClassName}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.15 }}
    >
      {icon && (
        <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </motion.button>
  );
});
