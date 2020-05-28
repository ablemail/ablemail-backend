const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const { mongodb, client, keys } = require('./config/config.json');

const authRoutes = require('./routes/authRoutes');
const getMailRoute = require('./routes/getMailRoute');
const sendRoute = require('./routes/sendRoute');

const app = express();
const PORT = 8000 || process.env.PORT;

mongoose.connect(mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(session({
  secret: keys.session,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: client,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}));

require('./helper/passport');

app.get('/', (req, res) => res.redirect(client));

app.use('/auth', authRoutes);
app.use('/get-mail', getMailRoute);
app.use('/send', sendRoute);


app.listen(PORT, () => console.log(`Listening on port ${ PORT }\n\n`));