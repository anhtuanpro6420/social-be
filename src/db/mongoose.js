const mongoose = require('mongoose');
const db = require('../config/keys').mongoURI;
mongoose
	.connect(db, {
		useCreateIndex: true,
		useNewUrlParser: true
	})
	.then(() => console.log('Mongo connected!'))
	.catch(err => console.log(err));
