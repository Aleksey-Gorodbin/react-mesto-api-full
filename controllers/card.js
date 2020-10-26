const Card = require('../models/card');
const ErrorConflict = require('../errors/conflict-error');
const ErrorRequest = require('../errors/error-request');
const NotFoundError = require('../errors/not-found-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new ErrorRequest('С запросом что-то не так')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => next(new ErrorRequest('С запросом что-то не так')));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      try {
        if (!card) {
          throw new NotFoundError('Нет карточки с таким id');
        } else if (!card.owner._id === req.user._id) {
          throw new ErrorConflict('Нельзя удалять чужие карточки');
        }
        res.send({ data: card });
      } catch (error) {
        throw new ErrorRequest('С запросом что-то не так');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const userId = req.user._id;

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
      } catch (error) {
        throw new ErrorRequest('С запросом что-то не так');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      try {
        if (!card) {
          throw new NotFoundError('Нет карточки с таким id');
        }
        res.send({ data: card });
      } catch (error) {
        throw new ErrorRequest('С запросом что-то не так');
      }
    })
    .catch(next);
};
