const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');
const validateRegister = require('../validation/register');
const validateLogin = require('../validation/login');

module.exports.register = async (req, res) => {
	const { errors, isValid } = validateRegister(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}
	const user = await User.findOne({ email: req.body.email });
	if (user) {
		errors.message = 'Email has already exist!';
		return res.status(400).send(errors);
	} else {
		const newUser = new User({
			email: req.body.email,
			password: req.body.password
		});

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;
				newUser.password = hash;
				newUser
					.save()
					.then(user => res.status(201).json(user))
					.catch(err => res.send(err));
			});
		});
	}
};

module.exports.login = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const { errors, isValid } = validateLogin(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email }).then(user => {
		if (!user) {
			errors.message = 'User not found!';
			return res.status(404).json(errors);
		}
		bcrypt.compare(password, user.password).then(isSame => {
			if (isSame) {
				const payload = {
					id: user.id
				};
				jwt.sign(
					payload,
					keys.secretOrKey,
					{ expiresIn: 3600 },
					(err, token) => {
						res.json({
							success: true,
							data: {
								token: `Bearer ${token}`,
								user: user.getPublicProfile()
							}
						});
					}
				);
			} else {
				errors.message = 'Password is incorrect';
				return res.status(400).json(errors);
			}
		});
	});
};
