const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const {
  routerUsersId,
  routerUsers,
  routerUpdateUser,
  routerUpdateUserAvatar,
  routerUsersInfo,
} = require('./routes/users');
const {
  router,
  routerDelete,
  routerCreate,
  routerDisLike,
  routerLike,
} = require('./routes/cards');

const {
  login,
  changeUser,
} = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-z0-9/\S+]#?/i),
    about: Joi.string().min(2).max(30),
  }),
}), changeUser);
app.use(auth);
app.use(routerUsersInfo);
app.use(routerUsersId);
app.use(routerUsers);
app.use(routerUpdateUser);
app.use(routerUpdateUserAvatar);
app.use(router);
app.use(routerCreate);
app.use(routerDelete);
app.use(routerLike);
app.use(routerDisLike);
app.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
