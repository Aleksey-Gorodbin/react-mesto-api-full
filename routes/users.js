const { celebrate, Joi } = require('celebrate');
const routerUsers = require('express').Router();
const routerUsersId = require('express').Router();
const routerUpdateUser = require('express').Router();
const routerUpdateUserAvatar = require('express').Router();
const {
  getUsers, getUserId, updateUser, updateUserAvatar,
} = require('../controllers/user');

routerUsers.get('/users', getUsers);
routerUsersId.get('/users/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex(),
  }),
}), getUserId);
routerUpdateUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
routerUpdateUserAvatar.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-z0-9/\S+]#?/i),
  }),
}), updateUserAvatar);

module.exports = {
  routerUsersId,
  routerUsers,
  routerUpdateUser,
  routerUpdateUserAvatar,
};
