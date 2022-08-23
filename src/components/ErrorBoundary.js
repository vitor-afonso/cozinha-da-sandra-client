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
