require('dotenv').config();
const express = require('express');
require('./db/mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const authRoute = require('./routes/api/auth');
const usersRoute = require('./routes/api/users');
const profileRoute = require('./routes/api/profile');
const postsRoute = require('./routes/api/posts');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
require('./config/passport')(passport);
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);

// config deploy prod
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('fe/build'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'fe', 'build', 'index.html'))
//   })
// }

const port = process.env.PORT || 4000;

app.listen(port, () =>
	console.log(`Server is running on port http://localhost:${port} ...`)
);
