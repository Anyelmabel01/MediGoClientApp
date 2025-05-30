// Simplified cipher-base polyfill for React Native
// This replaces the problematic cipher-base module that tries to import 'stream'

const { Buffer } = require('buffer');
const { Transform } = require('stream-browserify');
const { StringDecoder } = require('string_decoder');
const inherits = require('inherits');

function CipherBase(hashMode) {
  Transform.call(this);
  this.hashMode = typeof hashMode === 'string';
  if (this.hashMode) {
    this[hashMode] = this._finalOrDigest;
  } else {
    this['final'] = this._finalOrDigest;
  }
  if (this._final) {
    this.__final = this._final;
    this._final = null;
  }
  this._decoder = null;
  this._encoding = null;
}
inherits(CipherBase, Transform);

CipherBase.prototype.update = function (data, inputEnc, outputEnc) {
  if (typeof data === 'string') {
    data = Buffer.from(data, inputEnc);
  }
  
  const outData = this._update(data);
  if (this.hashMode) {
    return this;
  }

  if (outputEnc) {
    return this._toString(outData, outputEnc);
  }

  return outData;
};

CipherBase.prototype.setAutoPadding = function () {};
CipherBase.prototype.getAuthTag = function () {
  throw new Error('trying to get auth tag in unsupported state');
};

CipherBase.prototype.setAuthTag = function () {
  throw new Error('trying to set auth tag in unsupported state');
};

CipherBase.prototype.setAAD = function () {
  throw new Error('trying to set aad in unsupported state');
};

CipherBase.prototype._transform = function (data, _, next) {
  let err;
  try {
    if (this.hashMode) {
      this._update(data);
    } else {
      this.push(this._update(data));
    }
  } catch (e) {
    err = e;
  } finally {
    next(err);
  }
};

CipherBase.prototype._flush = function (done) {
  let err;
  try {
    this.push(this.__final());
  } catch (e) {
    err = e;
  }
  done(err);
};

CipherBase.prototype._finalOrDigest = function (outputEnc) {
  const outData = this.__final() || Buffer.alloc(0);
  if (outputEnc) {
    return this._toString(outData, outputEnc, true);
  }
  return outData;
};

CipherBase.prototype._toString = function (value, enc, fin) {
  if (!this._decoder) {
    this._decoder = new StringDecoder(enc);
    this._encoding = enc;
  }

  if (this._encoding !== enc) {
    throw new Error('can\'t switch encodings');
  }

  let out = this._decoder.write(value);
  if (fin) {
    out += this._decoder.end();
  }

  return out;
};

module.exports = CipherBase; 