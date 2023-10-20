const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res.status(401).send({ message: 'Токен не получен' });
    }

    const validToken = token.replace('Bearer ', '');
    const payload = jwt.verify(validToken, 'secret_code');

    req.user = payload;

    return next();
  } catch (error) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
};
module.exports = auth;
