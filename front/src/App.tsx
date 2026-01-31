import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary, LoadingSpinner } from './components/ui';

// Lazy load pages for code splitting
const SplashScreen = lazy(() => import('./pages/SplashScreen').then(module => ({ default: module.SplashScreen })));
const VotingView = lazy(() => import('./pages/VotingView').then(module => ({ default: module.VotingView })));
const DexView = lazy(() => import('./pages/DexView').then(module => ({ default: module.DexView })));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
          <LoadingSpinner message="Loading..." />
        </div>
      }>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/vote" element={<VotingView />} />
          <Route path="/dex" element={<DexView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

