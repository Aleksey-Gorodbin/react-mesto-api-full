const jwt = require('jsonwebtoken');
const ErrorAutorization = require('../errors/error-autorization');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.split(' ')[0] === 'Bearer') {
    next(new ErrorAutorization('Необходима авторизация'));
  }
  const token = authorization.split(' ')[1];
  let payload;

  try {
    payload = jwt.verify(token, process.env.SECRET);
  } catch (err) {
    next(new ErrorAutorization('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
