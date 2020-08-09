const router = require('express').Router();
const verifyHost = require('../middleware/verifyHost');
const authCheck = require('../middleware/authCheck');
const Settings = require('../models/settings');
const { createTransport, sendMail } = require('../helper/nodemailer');

router.get('/', verifyHost, authCheck, (req, res) =>
  Settings.findOne({ uid: req.user.user.id }).then(currentSettings => {
    if (currentSettings) {
      res.json(currentSettings);
    } else {
      new Settings({
        uid: req.user.user.id,
        tts: false,
        large: false,
        dyslexia: false,
        whitelist: [],
        help: '',
        contacts: [],
        voicemail: false
      }).save().then(settings => res.json(settings));
    }
  }));

router.post('/', verifyHost, authCheck, async (req, res) => {
  if (req.query.contacts) {
    req.query.contacts = JSON.parse(req.query.contacts);
  }
  await Settings.updateOne({ uid: req.user.user.id }, req.query);
  res.end();
});

router.post('/help', verifyHost, authCheck, async (req, res) => {
  const transport = await createTransport(req.user.user.id);
  const { sent } = await sendMail(req.user.user.id, transport, {
    to: req.query.help,
    subject: req.query.subject,
    text: req.query.body
  });
  res.json({ sent });
});

module.exports = router;