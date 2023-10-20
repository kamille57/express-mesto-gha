const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Получение токена из заголовка
    if (!token) {
      return res.status(401).send({ message: 'Необходима авторизация' });
    }

    const validToken = token.replace('Bearer ', ''); // Убираем "Bearer ", если он есть
    console.log(validToken);
    const payload = await jwt.verify(validToken, 'secret_code');

    req.user = payload;

    return next();
  } catch (error) {
    return res.status(401).send({ message: 'Неверный токен' });
  }
};

module.exports = auth;
