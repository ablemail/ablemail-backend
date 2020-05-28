const router = require('express').Router();
const verifyHost = require('../middleware/verifyHost');
const { createTransport, sendMail } = require('../helper/nodemailer');

router.post('/', verifyHost, async (req, res) => {
  const transport = await createTransport(req.user.user.id);
  const { sent } = await sendMail(req.user.user.id, transport, {
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.body // TODO: Style with HTML
  });
  res.json({ sent });
});

module.exports = router;