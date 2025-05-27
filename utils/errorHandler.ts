// Utility function to handle errors silently
export const handleError = (error: any) => {
  // En producción, podríamos enviar los errores a un servicio de monitoreo
  if (process.env.NODE_ENV === 'development') {
    // Ignore specific React Native text errors
    if (error?.message?.includes('Text strings must be rendered within a <Text> component')) {
      // Just ignore this specific error completely
      return;
    }
    
    console.error(error);
  }
};

// Utility function to wrap async functions and handle errors silently
export const wrapAsync = async <T>(fn: () => Promise<T>): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    handleError(error);
    return null;
  }
}; 