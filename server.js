const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const logger = require('morgan');

const authRoutes = require('./routes/authRoutes');
const getMailRoute = require('./routes/getMailRoute');
const sendRoute = require('./routes/sendRoute');
const settingsRoute = require('./routes/settingsRoute');

const app = express();
const PORT = 8000 || process.env.PORT;
const PRODUCTION = process.env.NODE_ENV === 'production';

const { mongodb, client, keys } = PRODUCTION ? {
  mongodb: { uri: process.env.MONGODB_URI },
  client: process.env.CLIENT,
  keys: { session: require('crypto-random-string')({ length: 10, type: 'url-safe' }) }
} : require('./config/config.json');

mongoose.connect(mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(logger('dev'));

app.use(session({
  secret: keys.session,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: client,
  credentials: true
}));

require('./helper/passport');

app.get('/', (req, res) => res.redirect(client));

app.use('/auth', authRoutes);
app.use('/get-mail', getMailRoute);
app.use('/send', sendRoute);
app.use('/settings', settingsRoute);


app.listen(PORT, () => console.log(`Listening on port ${ PORT }\n`));