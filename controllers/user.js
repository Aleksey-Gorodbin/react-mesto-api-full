const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorRequest = require('../errors/err-request');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      try {
        res.send({ data: users });
      } catch (error) {
        throw new ErrorRequest('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
        return;
      }
      res.send({ data: user });
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

module.exports.changeUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      try {
        if (err.name === MongoError || err.code === 11000) {
          res.status(409).send({ message: 'Пользователь с таким email уже существует.' });
        }
        res.status(201).send({ email: user.email, _id: user._id });
      } catch (e) {
        throw new ErrorRequest('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.requestContext.user._id, { name, about }, {
    new: true,
  })
    .then((user) => {
      try {
        res.send({ data: user });
      } catch (error) {
        throw new ErrorRequest('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.requestContext.user._id, { avatar })
    .then((user) => {
      try {
        res.send({ data: user });
      } catch (error) {
        throw new ErrorRequest('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  res.cookie('jwt', token, {
    maxAge: 3600000 * 24 * 7,
    httpOnly: true,
    sameSite: true,
  })
    .end();
};
