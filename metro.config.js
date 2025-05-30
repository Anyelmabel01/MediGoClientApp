const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable unstable package exports for Expo SDK 53 + Supabase compatibility
config.resolver.unstable_enablePackageExports = false;

// Add Node.js polyfills for React Native with comprehensive coverage
config.resolver.alias = {
  crypto: require.resolve('react-native-crypto'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  events: require.resolve('events'),
  util: require.resolve('util'),
  // Critical polyfills for hash-base and cipher-base issues
  'hash-base': require.resolve('./polyfills/hash-base-polyfill.js'),
  'cipher-base': require.resolve('./polyfills/cipher-base-polyfill.js'),
  // Additional polyfills for better Node.js compatibility
  'string_decoder': require.resolve('string_decoder'),
  'inherits': require.resolve('inherits'),
  'safe-buffer': require.resolve('buffer'),
  'process': require.resolve('./polyfills/process-polyfill.js'),
};

// Configure globals for better Node.js compatibility
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure source extensions include all necessary files
config.resolver.sourceExts.push('cjs');

module.exports = config; 