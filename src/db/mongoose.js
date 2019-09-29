const mongoose = require('mongoose');
mongoose
	.connect(
		process.env.MONGODB_URI ||
			'mongodb://localhost:27017/social-videos-dev',
		{
			useCreateIndex: true,
			useNewUrlParser: true
		}
	)
	.then(() => console.log('Mongo connected!'))
	.catch(err => console.log(err));
