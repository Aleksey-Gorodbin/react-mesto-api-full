const Card = require('../models/card');
const ErrorRequest = require('../errors/err-request');
const NotFoundError = require('../errors/not-found-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => {
      if (!cards) {
        throw new ErrorRequest('Произошла ошибка');
      }
      res.send({ data: cards })
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.requestContext.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => {
      if (!card) {
        throw new ErrorRequest('Произошла ошибка');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      try {
        if (!card) {
          throw new NotFoundError('Нет карточки с таким id');
        }
        res.send({ data: card });
      } catch (e) {
        throw new ErrorRequest('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const userId = req.requestContext.user._id;

  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: userId } },
    { new: true },
  )
  .then((card) => {
    try {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      res.send({ data: card });
    } catch (e) {
      throw new ErrorRequest('Произошла ошибка');
    }
  })
  .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const userId = req.requestContext.user._id;

  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true },
  )
  .then((card) => {
    try {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      res.send({ data: card });
    } catch (e) {
      throw new ErrorRequest('Произошла ошибка');
    }
  })
  .catch(next);
};
