/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const adminsRouter = require('./routes/admins');

app.use(adminsRouter);
app.use(usersRouter, auth);
app.use(cardsRouter, auth);

// Обработчик для несуществующих маршрутов
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
