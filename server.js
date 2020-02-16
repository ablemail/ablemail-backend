const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { mongodb } = require('./config/apis.json');
const cookieSession = require('cookie-session');
const { key } = require('./config/key.json');
const passport = require('passport');

const { authRoutes } = require('./routes/authRoutes');
const getMailRoute = require('./routes/getMailRoute');

const app = express();
const PORT = 8000 || process.env.PORT;

app.use(cors());

app.use(cookieSession({
  maxAge: 7 * 24 * 60 * 60 * 1000,
  keys: [key]
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => res.send(''));

app.use('/auth', authRoutes);
app.use('/get-mail', getMailRoute);

app.listen(PORT, () => console.log(`Listening on port ${ PORT }\nhttp://localhost:${ PORT }\n\n`));