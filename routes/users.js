const routerUsers = require('express').Router();
const routerUsersId = require('express').Router();
const routerUpdateUser = require('express').Router();
const routerUpdateUserAvatar = require('express').Router();
const {
  getUsers, getUserId, updateUser, updateUserAvatar,
} = require('../controllers/user');

routerUsers.get('/users', getUsers);
routerUsersId.get('/users/:_id', getUserId);
routerUpdateUser.patch('/users/me', updateUser);
routerUpdateUserAvatar.patch('/users/me/avatar', updateUserAvatar);

module.exports = {
  routerUsersId,
  routerUsers,
  routerUpdateUser,
  routerUpdateUserAvatar,
};
