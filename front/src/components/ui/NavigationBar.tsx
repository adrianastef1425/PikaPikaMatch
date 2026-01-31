import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export const NavigationBar = memo(function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = useMemo(() => [
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
  ], []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card-light dark:bg-card-dark border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-center items-center gap-8 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={`material-symbols-outlined text-3xl ${
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
                <span className="text-sm font-display font-medium">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
});
