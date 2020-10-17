const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorRequest = require('../errors/err-request');
const NotFoundError = require('../errors/not-found-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
  .then((users) => {
    if (!users) {
      throw new ErrorRequest('Произошла ошибка');
    }
    res.send({ data: users })
  })
  .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params._id)
  .then((user) => {
    try {
      if (!user) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      res.send({ data: user });
    } catch (e) {
      throw new ErrorRequest('Произошла ошибка');
    }
  })
  .catch(next);
};

module.exports.changeUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      if (!user) {
        throw new ErrorRequest('Произошла ошибка');
      }
      res.send({ data: user })
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.requestContext.user._id, { name, about }, {
    new: true,
  })
  .then((user) => {
    if (!user) {
      throw new ErrorRequest('Произошла ошибка');
    }
    res.send({ data: user })
  })
  .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.requestContext.user._id, { avatar })
  .then((user) => {
    if (!user) {
      throw new ErrorRequest('Произошла ошибка');
    }
    res.send({ data: user })
  })
  .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new ErrorRequest('Произошла ошибка');
      }
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {expiresIn: '7d'});
      res.send({ token });
    })
    .catch(next);
};
