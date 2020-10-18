const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
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

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
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
app.post('/signin', login);
app.post('/signup', changeUser);
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

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errors());
app.use((err, req, res, next) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT);
