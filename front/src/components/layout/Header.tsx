import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

export const Header = memo(function Header({ className = '' }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'vote' as const,
      path: '/vote',
      label: 'Vote',
      icon: 'favorite',
      ariaLabel: 'Navigate to voting view',
    },
    {
      id: 'dex' as const,
      path: '/dex',
      label: 'Dex',
      icon: 'menu_book',
      ariaLabel: 'Navigate to statistics view',
    },
  ];

  return (
    <motion.header
      className={`sticky top-0 z-20 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4 ${className}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <motion.span
            className="text-2xl md:text-3xl"
            animate={{
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          >
            ✨
          </motion.span>
          <h1 className="font-display font-bold text-xl md:text-2xl text-primary">
            PikaPikaMatch
          </h1>
        </div>

        {/* Navigation buttons */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={`material-symbols-outlined text-xl md:text-2xl ${
                    isActive ? 'font-bold' : ''
                  }`}
                  style={{
                    fontVariationSettings: isActive
                      ? '"FILL" 1, "wght" 700, "GRAD" 0, "opsz" 48'
                      : '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48',
                  }}
                >
                  {item.icon}
                </span>
                <span className="hidden sm:inline text-sm md:text-base font-display font-medium">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
});
