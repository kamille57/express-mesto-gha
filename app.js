/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mynewdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Мидлвэр для временного решения авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // Вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(express.json());
app.use(bodyParser.json());
// Роуты для пользователей
const userRouter = require('./routes/users');

app.use('/users', userRouter);

// Роуты для карточек
const cardRouter = require('./routes/cards');

app.use('/cards', cardRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
