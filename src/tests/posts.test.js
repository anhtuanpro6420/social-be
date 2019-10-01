const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const keys = require('../config/keys');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	email: 'admin@gmail.com',
	password: '123123'
};

const newPost = {
	videoInfo: {
		title: 'Just for testing',
		description: 'Just for testing description '
	},
	url: 'youtube.com/watch?v=dVvslK05bIA',
	user: userOneId
};

const token = jwt.sign({ id: userOneId }, keys.secretOrKey, {
	expiresIn: 360000
});

beforeEach(async () => {
	await User.deleteMany();
	await new User(userOne).save();
});

test('Should get all posts', async () => {
	await request(app)
		.get('/api/posts')
		.expect(200);
});

test('Should share post successfully', async () => {
	await request(app)
		.post('/api/posts')
		.set('Authorization', `Bearer ${token}`)
		.send(newPost)
		.expect(201);
});
