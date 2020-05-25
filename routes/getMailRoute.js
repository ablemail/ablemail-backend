const router = require('express').Router();
const verifyHost = require('../middleware/verifyHost');
const imap = require('../helper/imap');
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const cache = require('memory-cache');
const { keys } = require('../config/config.json');

const googleGetMailRoutes = require('./google/googleGetMailRoutes');

router.use('/google', googleGetMailRoutes);

router.get('/', verifyHost, async (req, res) => {
  const user = await User.findById(cache.get('user'));
  const mail = await imap({
    user: user.email,
    password: CryptoJS.AES.decrypt(user.password, keys.cipherKey).toString(CryptoJS.enc.Utf8),
    host: 'outlook.office365.com', // TODO: Add question for this on client side
    port: 993, // TODO: Also this but default to port 993
    tls: true
  });
  res.json(mail);
});

module.exports = router;