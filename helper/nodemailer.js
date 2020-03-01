const nodemailer = require('nodemailer');
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const { keys } = require('../config/config.json');

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
        secureConnection: false,
        secure: true,
        ignoreTLS: false,
        requireTLS: true,
        auth,
        tls: {
          ciphers: 'SSLv3'
        }
      };
      break;
    case 'outlook.com':
    case 'hotmail.com':
    case 'catlin.edu': // TODO: Remove
      config = {
        host: 'smtp.office365.com',
        port: 465,
        secureConnection: false,
        secure: true,
        ignoreTLS: false,
        requireTLS: true,
        auth,
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        }
      };
      break;
  }

  return await nodemailer.createTransport(config);
};

const sendMail = async (id, transport, mail) => {
  const user = await User.findById(id);
  if (!user) console.error('No user found');

  console.log({
    ...mail,
    from: `"${ user.name }" ${ user.email }`
  });

  transport.sendMail({
    from: `"${ user.name }" ${ user.email }`,
    ...mail
  }).then(() => console.log('sent'));
};

module.exports = { createTransport, sendMail };