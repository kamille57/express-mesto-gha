const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
// const cookieParser = require('cookie-parser'); // добавьте эту строку

const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const adminsRouter = require('./routes/admins');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
// app.use(cookieParser()); // добавьте эту строку перед использованием cookies
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(adminsRouter);
app.use(auth);
app.use(usersRouter);
app.use(cardsRouter);

// Обработчик для несуществующих маршрутов
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
