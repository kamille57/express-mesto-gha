/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  req.user = {
    _id: '6519dcc4bc240f1a286369a5', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use((req, res, next) => {
  req.user = {
    _id: '6519dcc4bc240f1a286369a5', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
