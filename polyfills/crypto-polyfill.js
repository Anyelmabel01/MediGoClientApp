// Dedicated crypto polyfill for React Native
import { getRandomValues } from 'react-native-get-random-values';

// Ensure crypto object exists with all necessary methods
if (!global.crypto) {
  global.crypto = {};
}

// Ensure getRandomValues is available
if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = getRandomValues;
}

// Add deprecated seed method for compatibility
if (!global.crypto.seed) {
  global.crypto.seed = function() {
    console.warn('crypto.seed is deprecated and not needed in React Native');
  };
}

// Add other crypto methods that might be needed
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = function() {
    // Simple UUID v4 implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

export default global.crypto; 