const errorsHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500 ? 'Ошибка на сервере' : err.message;
  res.status(statusCode).json({ message });
  next();
};

module.exports = { errorsHandler };
