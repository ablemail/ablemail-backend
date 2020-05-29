const router = require('express').Router();
const verifyHost = require('../middleware/verifyHost');
const authCheck = require('../middleware/authCheck');
const imap = require('../helper/imap');
const CryptoJS = require('crypto-js');
const { keys } = require('../config/config.json');

const googleGetMailRoutes = require('./google/googleGetMailRoutes');

router.use('/google', googleGetMailRoutes);

router.get('/', verifyHost, authCheck, async (req, res) => {
  const mail = await imap({
    user: req.user.user.email,
    password: CryptoJS.AES.decrypt(req.user.user.password, keys.cipherKey).toString(CryptoJS.enc.Utf8),
    host: 'outlook.office365.com', // TODO: Add question for this on client side
    port: 993, // TODO: Also this but default to port 993
    tls: true
  });
  res.json(mail);
});

module.exports = router;