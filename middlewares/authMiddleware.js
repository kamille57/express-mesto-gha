const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.mestoToken;

    if (!token) {
      return res.status(401).send({ message: 'Токен не получен' });
    }

    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, 'secret_code');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'Проблема с токеном' });
    }
    if (error.message === 'Email and password are required') {
      return res.status(401).send({ message: 'Необходима авторизация' });
    }
    return res.status(500).send({ message: error.message });
  }
  req.user = payload;
  return next();
};

module.exports = authMiddleware;
