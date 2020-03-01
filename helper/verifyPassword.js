const CryptoJS = require('crypto-js');
const { keys } = require('../config/config.json');

const verifyPassword = (savedPass, password) => password === CryptoJS.AES.decrypt(savedPass, keys.cipherKey).toString(CryptoJS.enc.Utf8);

module.exports = verifyPassword;