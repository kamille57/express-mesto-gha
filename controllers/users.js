/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Получить всех пользователей
module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Получить пользователя по _id
module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: 'Некорректный id пользователя' });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Создать нового пользователя
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10); // хеширование пароля

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  User.create({
    name, about, avatar, email, password: hashedPassword,
  })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server error occurred', error: err });
    });
};

// Обновить профиль
module.exports.updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  if (!name || !about) {
    return res.status(400).send({ message: 'Name and about are required' });
  }

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server error occurred', error: err });
    });
};

// Обновить аватар
module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(400).send({ message: 'Avatar is required' });
  }

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server error occurred', error: err });
    });
};
