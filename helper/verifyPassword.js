const CryptoJS = require('crypto-js');

const PRODUCTION = process.env.NODE_ENV === 'production';

const { keys } = PRODUCTION ? {
  keys: { cipherKey: require('crypto-random-string')({ length: 100, type: 'url-safe' }) }
} : require('../config/config.json');

const verifyPassword = (savedPass, password) => password === CryptoJS.AES.decrypt(savedPass, keys.cipherKey).toString(CryptoJS.enc.Utf8);

module.exports = verifyPassword;