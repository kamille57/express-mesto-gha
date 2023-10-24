const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const authMiddleware = async (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.mestoToken;

    if (!token) {
      throw new UnauthorizedError('Токен не получен');
    }

    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, 'secret_code');
  } catch (error) {
    let errorMessage = 'Ошибка авторизации';
    if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Проблема с токеном или требуется авторизация';
    }
    return next(new UnauthorizedError(errorMessage));
  }
  req.user = payload;
  return next();
};

module.exports = authMiddleware;
