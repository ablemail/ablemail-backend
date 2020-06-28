const router = require('express').Router();
const verifyHost = require('../middleware/verifyHost');
const authCheck = require('../middleware/authCheck');
const Settings = require('../models/settings');

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

module.exports = router;