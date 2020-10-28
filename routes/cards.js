const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const routerCreate = require('express').Router();
const routerDelete = require('express').Router();
const routerLike = require('express').Router();
const routerDisLike = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

router.get('/cards', getCards);
routerCreate.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(/https?:\/\/(www\.)?[a-z0-9/\S+]#?/i),
  }),
}), createCard);
routerDelete.delete('/cards/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), deleteCard);
routerLike.put('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), likeCard);
routerDisLike.delete('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = {
  router,
  routerDelete,
  routerCreate,
  routerDisLike,
  routerLike,
};
