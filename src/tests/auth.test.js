const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/User');
const keys = require('../config/keys');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	email: 'admin@gmail.com',
	password: '123123'
};

bcrypt.genSalt(10, (err, salt) => {
	console.log(salt);
	bcrypt.hash(userOne.password, salt, (err, hash) => {
		if (err) throw err;
		userOne.password = hash;
		console.log(userOne.password);
	});
});
// const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });

beforeEach(async () => {
	await User.deleteMany();
	await new User(userOne).save();
});

test('Should register a new user', async () => {
	await request(app)
		.post('/api/auth/register')
		.send({
			email: 'tuan1@gmail.com',
			password: 'Si@212194'
		})
		.expect(201);
});

test('Should login with existing user', async () => {
	await request(app)
		.post('/api/auth/login')
		.send({
			email: userOne.email,
			password: '123123'
		})
		.expect(200);
});
