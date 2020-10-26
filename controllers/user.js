const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorConflict = require('../errors/conflict-error');
const ErrorAutorization = require('../errors/error-autorization');
const ErrorRequest = require('../errors/error-request');
const NotFoundError = require('../errors/not-found-error');
//----------------------------------------------------------
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((e) => {
      if (e.name === 'Error') {
        next(new ErrorAutorization('Неправильные почта или пароль'));
      }
      next(new ErrorRequest('С запросом что-то не так'));
    });
};
//---------------------------------------------------------------
module.exports.changeUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({ email: user.email, _id: user._id });
    })
    .catch((e) => {
      if (e.name === 'MongoError') {
        next(new ErrorConflict('Пользователь с таким email уже существует'));
      }
      next(new ErrorRequest('С запросом что-то не так'));
    });
};
//------------------------------------------------------------
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new ErrorRequest('С запросом что-то не так');
      }
      res.send({ data: users });
    })
    .catch(next);
};
//----------------------------------------------------------------
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      try {
        if (!user) {
          throw new NotFoundError('Нет пользователя с таким id');
        }
        res.send({ data: user });
      } catch (error) {
        throw new ErrorRequest('С запросом что-то не так');
      }
    })
    .catch(next);
};
//-----------------------------------------------
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
  })
    .then((user) => res.send({ data: user }))
    .catch(() => next(new ErrorRequest('С запросом что-то не так')));
};
//-----------------------------------------------------------
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => next(new ErrorRequest('С запросом что-то не так')));
};
