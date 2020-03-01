const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const { mongodb, client, keys } = require('./config/config.json');

const authRoutes = require('./routes/authRoutes');
const getMailRoute = require('./routes/getMailRoute');
const sendRoute = require('./routes/sendRoute');

const app = express();
const PORT = 8000 || process.env.PORT;

app.use(cors());

app.use(cookieSession({
  maxAge: 7 * 24 * 60 * 60 * 1000,
  keys: [keys.reqKey]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => res.redirect(client));

app.use('/auth', authRoutes);
app.use('/get-mail', getMailRoute);
app.use('/send', sendRoute);


app.listen(PORT, () => console.log(`Listening on port ${ PORT }\n\n`));