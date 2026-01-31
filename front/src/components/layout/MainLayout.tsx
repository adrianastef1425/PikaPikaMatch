import { memo } from 'react';
import type { ReactNode } from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  className?: string;
}

export const MainLayout = memo(function MainLayout({
  children,
  showHeader = true,
  className = '',
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-gray-900 focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Header */}
      {showHeader && <Header />}

      {/* Main content area */}
      <main id="main-content" className={`flex-1 ${className}`}>
        {children}
      </main>
    </div>
  );
});
