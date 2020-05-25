const router = require('express').Router();
const axios = require('axios');
const cache = require('memory-cache');
const { google } = require('../../config/config.json');
const verifyHost = require('../../middleware/verifyHost');
const decodeQuery = require('../../helper/decodeQuery');

router.get('/', verifyHost, async (req, res) => {
  const data = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages?key=${ google.clientSecret }`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${ cache.get('user') }`
    }
  });

  let messages = [];
  let i = 0;
  for (const message of data.data.messages) {
    const m = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${ message.id }?key=${ google.clientSecret }`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ cache.get('user') }`
      }
    });
    messages.push(m.data);
    if (i++ === 5) {
      break;
    }
  }
  res.json(messages);
});

router.get('/get-one', verifyHost, async (req, res) => {
  const query = decodeQuery(req.query);
  res.json(await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${ query.id }?key=${ google.clientSecret }`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${ cache.get('user') }`
    }
  }))
});

module.exports = router;