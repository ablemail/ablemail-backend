const nodemailer = require('nodemailer');
const User = require('../models/user');
const CryptoJS = require('crypto-js');

const PRODUCTION = process.env.NODE_ENV === 'production';

const { keys } = PRODUCTION ? {
  keys: { cipherKey: require('crypto-random-string')({ length: 100, type: 'url-safe' }) }
} : require('../config/config.json');

const createTransport = async userID => {
  const user = await User.findById(userID);
  if (!user) console.error('No user found');

  const auth = {
    user: user.email,
    pass: CryptoJS.AES.decrypt(user.password, keys.cipherKey).toString(CryptoJS.enc.Utf8)
  };
  let config;
  switch (user.email.split('@')[1]) {
    case 'gmail.com':
      config = {
        host: 'smtp.gmail.com',
        port: 465,
        auth
      };
      break;
    case 'outlook.com':
    case 'hotmail.com':
    case 'catlin.edu': // TODO: Remove
      config = {
        host: 'smtp.office365.com',
        port: 587,
        auth
      };
      break;
  }

  return nodemailer.createTransport(config);
};

const sendMail = async (id, transport, mail) => {
  const user = await User.findById(id);
  if (!user) console.error('No user found');

  await transport.sendMail({
    from: `"${ user.name }" ${ user.email }`,
    ...mail
  });
  transport.close();
  return { sent: true };
};

module.exports = { createTransport, sendMail };