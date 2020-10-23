const router = require('express').Router();
const routerCreate = require('express').Router();
const routerDelete = require('express').Router();
const routerLike = require('express').Router();
const routerDisLike = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

router.get('/cards', getCards);
routerCreate.post('/cards', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), createCard);
routerDelete.delete('/cards/:_id', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
  }),
}), deleteCard);
routerLike.put('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
  }),
}), likeCard);
routerDisLike.delete('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
  }),
}), dislikeCard);

module.exports = {
  router,
  routerDelete,
  routerCreate,
  routerDisLike,
  routerLike,
};
