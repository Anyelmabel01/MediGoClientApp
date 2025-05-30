// Essential polyfills for Expo SDK 53 + Supabase
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Buffer polyfill - MUST be first
import { Buffer } from 'buffer';
global.Buffer = global.Buffer || Buffer;

// Process polyfill
const processPolyfill = require('./polyfills/process-polyfill.js');
global.process = global.process || processPolyfill;

// Stream polyfill - This should resolve the hash-base issue
const stream = require('stream-browserify');
global.stream = stream;

// Enhanced crypto polyfill - Import dedicated crypto setup
import './polyfills/crypto-polyfill.js';

// Events polyfill
import { EventEmitter } from 'events';
global.EventEmitter = EventEmitter;

// Util polyfill
import util from 'util';
global.util = util;

// Assert polyfill
import assert from 'assert';
global.assert = assert;

// TextEncoder/TextDecoder for web compatibility
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Additional Node.js compatibility
global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));
global.clearImmediate = global.clearImmediate || clearTimeout;

// Disable WebSocket for server-side modules (safety measure)
if (!global.WebSocket) {
  global.WebSocket = class WebSocket {
    constructor() {
      throw new Error('WebSocket not supported in React Native runtime');
    }
  };
} 