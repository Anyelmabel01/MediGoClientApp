// Essential polyfills for Expo SDK 53 + Supabase
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Buffer polyfill - MUST be first
import { Buffer } from 'buffer';
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// Process polyfill
try {
  const processPolyfill = require('./polyfills/process-polyfill.js');
  if (typeof global.process === 'undefined') {
    global.process = processPolyfill;
  }
} catch (error) {
  console.warn('Process polyfill not found, using minimal implementation');
  global.process = {
    env: {},
    version: '',
    platform: 'react-native',
    nextTick: (callback) => setTimeout(callback, 0)
  };
}

// Stream polyfill - This should resolve the hash-base issue
try {
  const stream = require('stream-browserify');
  global.stream = stream;
} catch (error) {
  console.warn('Stream polyfill failed to load');
}

// Events polyfill
try {
  const { EventEmitter } = require('events');
  global.EventEmitter = EventEmitter;
} catch (error) {
  console.warn('Events polyfill failed to load');
}

// Util polyfill
try {
  const util = require('util');
  global.util = util;
} catch (error) {
  console.warn('Util polyfill failed to load');
}

// Assert polyfill
try {
  const assert = require('assert');
  global.assert = assert;
} catch (error) {
  console.warn('Assert polyfill failed to load');
}

// TextEncoder/TextDecoder for web compatibility
if (typeof global.TextEncoder === 'undefined') {
  try {
    const { TextEncoder, TextDecoder } = require('text-encoding');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  } catch (error) {
    console.warn('TextEncoder/TextDecoder polyfill failed to load');
  }
}

// Additional Node.js compatibility
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}
if (typeof global.clearImmediate === 'undefined') {
  global.clearImmediate = clearTimeout;
}

// Ensure global object has all necessary properties
if (typeof global === 'undefined') {
  // This should never happen in React Native, but just in case
  let global = globalThis || window || {};
}

// Fix potential undefined property access issues
global.S = global.S || {};
global.default = global.default || {};

// Disable WebSocket for server-side modules (safety measure)
if (!global.WebSocket) {
  global.WebSocket = class WebSocket {
    constructor() {
      throw new Error('WebSocket not supported in React Native runtime');
    }
  };
} 