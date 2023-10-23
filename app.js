const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { NotFoundError } = require('./errors/NotFoundError');

const router = require('./routes/routers');
const {
  errorsHandler,
} = require('./middlewares/errorsHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(router);
app.use(errors());
app.use(errorsHandler);

// Middleware для обработки несуществующих маршрутов
app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
