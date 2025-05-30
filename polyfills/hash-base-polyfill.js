// Hash-base polyfill for React Native
const stream = require('stream');
const { Buffer } = require('buffer');

// Create a simple Transform stream for hash-base compatibility
class HashBase extends stream.Transform {
  constructor(blockSize, finalSize) {
    super();
    this._blockSize = blockSize;
    this._finalSize = finalSize;
    this._buffer = Buffer.allocUnsafe(0);
    this._length = 0;
  }

  _transform(chunk, encoding, callback) {
    this.update(chunk);
    callback();
  }

  _flush(callback) {
    this.push(this.digest());
    callback();
  }

  update(data) {
    if (typeof data === 'string') {
      data = Buffer.from(data, 'utf8');
    }
    this._buffer = Buffer.concat([this._buffer, data]);
    this._length += data.length;
    return this;
  }

  digest(encoding) {
    // This is a simplified implementation
    // The actual hash computation would happen here
    const result = Buffer.from('dummy-hash');
    return encoding ? result.toString(encoding) : result;
  }
}

module.exports = HashBase; 