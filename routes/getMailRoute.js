const router = require('express').Router();
const axios = require('axios');
const { google } = require('../config/apis.json');
const verifyKey = require('../middleware/verifyKey');

router.get('/', verifyKey, async (req, res) => {
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
    if (temp === 5) {
      break;
    } else {
      temp++;
    }
  }
  res.json(messages);
});

router.get('/get-one', verifyKey, async (req, res) => {
  res.json(await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${ req.query.id }?key=${ google.clientSecret }`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${ req.query.token }`
    }
  }));
});

module.exports = router;