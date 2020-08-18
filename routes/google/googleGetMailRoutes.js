const router = require('express').Router();
const axios = require('axios');
const verifyHost = require('../../middleware/verifyHost');
const authCheck = require('../../middleware/authCheck');
const decodeQuery = require('../../helper/decodeQuery');

const PRODUCTION = process.env.NODE_ENV === 'production';

const { google } = PRODUCTION ? {
  google: {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
    callbackURL: process.env.GOOGLE_CALLBACKURL
  }
} : require('../../config/config.json');

router.get('/', verifyHost, authCheck, async (req, res) => {
  const data = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages?key=${ google.clientSecret }`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${ req.user.accessToken }`
    }
  });

  let messages = [];
  let i = 0;
  for (const message of data.data.messages) {
    const m = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${ message.id }?key=${ google.clientSecret }`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ req.user.accessToken }`
      }
    });
    messages.push(m.data);
    if (i++ === 5) {
      break;
    }
  }
  res.json(messages);
});

router.get('/get-one', verifyHost, authCheck, async (req, res) => {
  const query = decodeQuery(req.query);
  res.json(await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${ query.id }?key=${ google.clientSecret }`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${ req.user.accessToken }`
    }
  }));
});

router.post('/read-one', verifyHost, authCheck, async (req, res) => {
  const query = decodeQuery(req.query);
  await axios.post(`https://www.googleapis.com/gmail/v1/users/me/messages/${ query.id }/modify?key=${ google.clientSecret }`, JSON.stringify({
    removeLabelIds: ['UNREAD']
  }), {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ req.user.accessToken }`
    }
  });
  res.end();
});

module.exports = router;