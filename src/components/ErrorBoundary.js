// jshint esversion:11

function ErrorFallback({ error, resetErrorBoundary }) {
  console.log('ErrorFallback =>', error.message);
  return (
    <div role='alert'>
      <p>Algo correu mal:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Tentar novamente</button>
    </div>
  );
}

export default ErrorFallback;

//=> to use when lazy loading components
{
  /* 
  import React, { lazy, Suspense } from 'react';
  import { ErrorBoundary } from 'react-error-boundary';
  import ErrorFallback from './components/ErrorBoundary';

  
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      window.location.reload();
    }}
  >
    <Suspense fallback={<CircularProgress sx={{ mt: 20 }} />}>
      <AboutPage /> // <= component to lazy load
    </Suspense>
  </ErrorBoundary>;
  
   */
}
