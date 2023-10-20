/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const generateToken = require('../utils/jwt');

const SALT_ROUNDS = 10;

// Получить всех пользователей
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send({ data: users });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Получить пользователя по _id
module.exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: 'Invalid user id' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res.status(200).send({ data: user });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Создать нового пользователя
module.exports.createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    return res.status(201).send({ email: user.email, id: user._id });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Email and password are required' });
    } if (err.code === 11000) {
      return res.status(409).send({ message: 'User with this email already exists' });
    }
    return res.status(500).send({ message: 'Server error occurred', error: err });
  }
};

// залогиниться
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userLogined = await User.findOne({ email }).select('+password');
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }
    if (!userLogined) {
      return res.status(401).send({ message: 'Incorrect email or password' });
    }
    const matched = await bcrypt.compare(password, userLogined.password);
    if (!matched) {
      return res.status(401).send({ message: 'Incorrect email or password' });
    }
    const token = generateToken({ id: userLogined._id });
    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: 'Server error occurred', error: err });
  }
};

// Обновить профиль
module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;

    if (!name || !about) {
      return res.status(400).send({ message: 'Name and about are required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }

    return res.status(200).send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: 'Server error occurred', error: err });
  }
};

// Обновить аватар
module.exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).send({ message: 'Avatar is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res.status(200).send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: err.message });
    }

    return res.status(500).send({ message: 'Server error occurred', error: err });
  }
};
