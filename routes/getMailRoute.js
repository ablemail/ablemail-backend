const router = require('express').Router();
const axios = require('axios');
const { google } = require('../config/apis.json');
const verifyKey = require('../middleware/verifyKey');
const imap = require('../helper/imap');
const User = require('../models/user');

router.get('/google', verifyKey, async (req, res) => {
  const data = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages?key=${ google.clientSecret }`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${ req.query.token }`
    }
  });

  let messages = [];
  let temp = 0;
  for (const message of data.data.messages) {
    const m = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${ message.id }?key=${ google.clientSecret }`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ req.query.token }`
      }
    });
    messages.push(m.data);
    if (temp++ === 5) {
      break;
    }
  }
  res.json(messages);
});

router.get('/google/get-one', verifyKey, async (req, res) => {
  res.json(await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${ req.query.id }?key=${ google.clientSecret }`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${ req.query.token }`
    }
  }));
});

router.get('/', verifyKey, async (req, res) => {
  const user = await User.findById(req.query.id);
  const mail = await imap({
    user: user.email,
    password: user.password,
    host: 'outlook.office365.com', // TODO: Add question for this on client side
    port: 993, // TODO: Also this but default to port 993
    tls: true
  });
  res.json(mail);
});

module.exports = router;