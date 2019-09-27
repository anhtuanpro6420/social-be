const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const keys = require('../config/keys');
const User = require('../models/User');
const validateRegister = require('../validation/register');
const validateLogin = require('../validation/login');

module.exports.test = (req, res) => res.json({msg: 'User works'})

module.exports.register = (req, res) => {
  const { errors, isValid } = validateRegister(req.body);

  if (!isValid)  {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = 'Email has already exist!';
        return res.status(400).send(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });
        const newUser = new User({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          avatar
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => res.send(err))
          })
        })
      }
    })
}

module.exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { errors, isValid } = validateLogin(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({email})
    .then(user => {
      if (!user) {
        errors.email = 'User not found!';
        return res.status(404).json(errors);
      }
      bcrypt.compare(password, user.password)
        .then(isSame => {
          if (isSame) {
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: true,
                token: `Bearer ${token}`
              })
            });
          } else {
            errors.password = 'Password is incorrect';
            return res.status(400).json(errors);
          }
        })
    })
}

module.exports.getMyInfo = (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar
  })
}
