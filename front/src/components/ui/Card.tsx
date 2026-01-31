import { memo } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'stacked';
  children: ReactNode;
}

export const Card = memo(function Card({
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const baseStyles = 'bg-card-light dark:bg-card-dark rounded-lg overflow-hidden';
  const shadowStyles = variant === 'default' ? 'shadow-card' : '';
  
  const combinedClassName = `${baseStyles} ${shadowStyles} ${className}`;

  if (variant === 'stacked') {
    return (
      <div className="relative">
        {/* Background stacked cards */}
        <div className="absolute inset-0 bg-card-light dark:bg-card-dark rounded-lg transform translate-y-2 translate-x-1 opacity-40 -z-10" />
        <div className="absolute inset-0 bg-card-light dark:bg-card-dark rounded-lg transform translate-y-1 translate-x-0.5 opacity-60 -z-5" />
        
        {/* Main card */}
        <div className={combinedClassName} {...props}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
});
