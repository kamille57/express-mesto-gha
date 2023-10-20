// Обработчик ошибки 400 (Bad Request)
module.exports.BadRequest = (err, req, res, next) => {
  if (err.statusCode === 400) {
    return res.status(400).send({ message: err.message });
  }
  return next(err);
};

// Обработчик ошибки 401 (Unauthorized)
module.exports.Unauthorized = (err, req, res, next) => {
  if (err.statusCode === 401) {
    return res.status(401).send({ message: err.message });
  }
  return next(err);
};

// Обработчик ошибки 404 (Not Found)
module.exports.NotFoundError = (err, req, res, next) => {
  if (err.statusCode === 404) {
    return res.status(404).send({ message: err.message });
  }
  return next(err);
};

// Обработчик ошибки 409 (Conflict)
module.exports.ConflictError = (err, req, res, next) => {
  if (err.statusCode === 409) {
    return res.status(409).send({ message: err.message });
  }
  return next(err);
};

// Обработчик ошибки 500 (Internal Server Error)
module.exports.InternalServerError = (err, req, res) => {
  res.status(500).send({ message: 'Internal Server Error' });
};
