// Enhanced process polyfill for React Native
const process = {
  env: { NODE_ENV: __DEV__ ? 'development' : 'production' },
  version: 'v16.0.0',
  platform: 'darwin', // or 'linux', 'win32' etc.
  browser: true,
  
  nextTick: typeof setImmediate !== 'undefined' 
    ? setImmediate 
    : (fn) => setTimeout(fn, 0),
  
  // Additional process methods that might be needed
  cwd: () => '/',
  exit: (code) => {
    console.warn('process.exit called with code:', code);
  },
  
  // Standard output/error streams
  stdout: {
    write: (data) => console.log(data)
  },
  stderr: {
    write: (data) => console.error(data)
  },
  
  // Event emitter methods (basic implementation)
  on: () => {},
  once: () => {},
  emit: () => {},
  removeListener: () => {},
  removeAllListeners: () => {},
  
  // Memory usage (dummy implementation)
  memoryUsage: () => ({
    rss: 1024 * 1024 * 50, // 50MB
    heapTotal: 1024 * 1024 * 30, // 30MB
    heapUsed: 1024 * 1024 * 20, // 20MB
    external: 1024 * 1024 * 5, // 5MB
  }),
  
  // Process uptime (dummy implementation)
  uptime: () => Date.now() / 1000,
  
  // High resolution time
  hrtime: (time) => {
    const now = Date.now();
    if (time) {
      const diff = now - (time[0] * 1000 + time[1] / 1000000);
      return [Math.floor(diff / 1000), (diff % 1000) * 1000000];
    }
    return [Math.floor(now / 1000), (now % 1000) * 1000000];
  }
};

module.exports = process; 