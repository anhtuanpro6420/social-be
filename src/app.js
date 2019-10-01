require('dotenv').config();
const express = require('express');
require('./db/mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const authRoute = require('./routes/api/auth');
const postsRoute = require('./routes/api/posts');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
require('./config/passport')(passport);
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);

module.exports = app;
