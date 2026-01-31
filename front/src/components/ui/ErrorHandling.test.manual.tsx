/**
 * Manual test file for error handling components
 * 
 * To test these components:
 * 1. Import them into a page or component
 * 2. Trigger error states in the application
 * 3. Verify the error messages and retry functionality work correctly
 */

import { ErrorBoundary } from './ErrorBoundary';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';

// Example 1: Testing ErrorBoundary
export function TestErrorBoundary() {
  const ThrowError = () => {
    throw new Error('Test error from component');
  };

  return (
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
}

// Example 2: Testing ErrorMessage with retry
export function TestErrorMessage() {
  const handleRetry = () => {
    console.log('Retry clicked');
    // Implement retry logic
  };

  return (
    <div className="p-8">
      <ErrorMessage 
        message="Failed to load data. Please try again."
        onRetry={handleRetry}
      />
    </div>
  );
}

// Example 3: Testing LoadingSpinner
export function TestLoadingSpinner() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-bold">Small Spinner</h3>
        <LoadingSpinner size="sm" message="Loading..." />
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-bold">Medium Spinner</h3>
        <LoadingSpinner size="md" message="Loading data..." />
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-bold">Large Spinner</h3>
        <LoadingSpinner size="lg" message="Loading statistics..." />
      </div>
    </div>
  );
}

// Example 4: Testing error handling in async operations
export function TestAsyncErrorHandling() {
  const simulateError = async () => {
    throw new Error('Network request failed');
  };

  const handleClick = async () => {
    try {
      await simulateError();
    } catch (error) {
      console.error('Caught error:', error);
    }
  };

  return (
    <div className="p-8">
      <button 
        onClick={handleClick}
        className="px-4 py-2 bg-primary rounded-lg"
      >
        Trigger Async Error
      </button>
    </div>
  );
}
