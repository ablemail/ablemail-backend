const router = require('express').Router();
const axios = require('axios');
const { google } = require('../../config/config.json');
const verifyKey = require('../../middleware/verifyKey');
const decodeQuery = require('../../helper/decodeQuery');

router.get('/', verifyKey, async (req, res) => {
  const query = decodeQuery(req.query);
  const data = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages?key=${ google.clientSecret }`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${ query.token }`
    }
  });

  let messages = [];
  let temp = 0;
  for (const message of data.data.messages) {
    const m = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${ message.id }?key=${ google.clientSecret }`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ query.token }`
      }
    });
    messages.push(m.data);
    if (temp++ === 5) {
      break;
    }
  }
  res.json(messages);
});

router.get('/get-one', verifyKey, async (req, res) => {
  const query = decodeQuery(req.query);
  res.json(await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${ query.id }?key=${ google.clientSecret }`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${ query.token }`
    }
  }))
});