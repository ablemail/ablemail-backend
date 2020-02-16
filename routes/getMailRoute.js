const router = require('express').Router();
const axios = require('axios');
const { google } = require('../config/apis.json');
const accessToken = require('../passport');
const verifyKey = require('../middleware/verifyKey');
const { user } = require('./authRoutes');

router.get('/', verifyKey, async (req, res) => {
  const email = (await user).email;
  const data = await axios.get(`https://www.googleapis.com/gmail/v1/users/${ email }/messages?key=${ google.clientSecret }`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${ await accessToken }`
    }
  });
  res.json(data.data.messages);
});

module.exports = router;