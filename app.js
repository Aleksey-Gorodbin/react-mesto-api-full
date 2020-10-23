const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors, celebrate, Joi } = require('celebrate');
const {
  routerUsersId,
  routerUsers,
  routerUpdateUser,
  routerUpdateUserAvatar,
} = require('./routes/users');
const {
  router,
  routerDelete,
  routerCreate,
  routerDisLike,
  routerLike,
} = require('./routes/cards');
const {
  changeUser, login,
} = require('./controllers/user');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-error');

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
app.use(requestLogger);
app.use(errorLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(cors());
app.use(cookieParser());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), changeUser);
app.use(auth);
app.use(routerUsersId);
app.use(routerUsers);
app.use(routerUpdateUser);
app.use(routerUpdateUserAvatar);

app.use(router);
app.use(routerCreate);
app.use(routerDelete);
app.use(routerLike);
app.use(routerDisLike);

app.all('*', () => {
  throw new NotFoundError('Роута не существует');
});

app.use(errors());
app.use((err, req, res) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT, () => {});
