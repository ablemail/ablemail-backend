const router = require('express').Router();
const verifyKey = require('../middleware/verifyKey');
const { createTransport, sendMail } = require('../helper/nodemailer');

router.post('/', async (req, res) => { // TODO: Add key
  const transport = await createTransport(req.body.id);
  const { sent } = await sendMail(req.body.id, transport, {
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.body // TODO: Style with HTML
  });
  res.json({ sent });
});

module.exports = router;