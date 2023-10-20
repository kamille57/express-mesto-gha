const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/jwt');
const User = require('../models/user');
const {
  BadRequest,
  Unauthorized,
  NotFoundError,
  ConflictError,
  InternalServerError,
} = require('../middlewares/errorHandler');

const SALT_ROUNDS = 10;

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => next(new InternalServerError(err.message)));
};

module.exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequest('Некорректный Id пользователя');
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }

    res.status(200).send(user);
  } catch (error) {
    next(new InternalServerError('Ошибка сервера'));
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return next(new BadRequest('Email и пароль обязательны'));
  }

  try {
    const hash = await bcrypt.hash(String(password), SALT_ROUNDS);

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
      return next(new BadRequest('Email и пароль обязательны'));
    } if (err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(new InternalServerError('Ошибка сервера'));
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userLogined = await User.findOne({ email }).select('+password');
    if (!email || !password) {
      return next(new BadRequest('Email и пароль обязательны'));
    }
    if (!userLogined) {
      return next(new Unauthorized('Пользователь неавторизован'));
    }
    const matched = await bcrypt.compare(String(password), userLogined.password);
    if (!matched) {
      return next(new Unauthorized('Неправильная почта или пароль'));
    }
    const token = generateToken({ id: userLogined._id });
    res.cookie('mestoToken', token, { maxAge: 3600000000, httpOnly: true, sameSite: true });
    return res.status(200).send({ token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequest('Email и пароль обязательны'));
    }
    return next(new InternalServerError('Ошибка сервера'));
  }
};

// Обновить профиль
module.exports.updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  try {
    if (!name || !about) {
      throw new BadRequest('Email и пароль обязательны');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }

    return res.status(200).send({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new BadRequest('Email и пароль обязательны');
    }

    throw new InternalServerError('Ошибка сервера');
  }
};

// Обновить аватар
module.exports.updateAvatar = async (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  try {
    if (!avatar) {
      return res.status(400).send({ message: 'Avatar is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }

    return res.status(200).send({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new BadRequest('Email и пароль обязательны');
    }

    throw new InternalServerError('Ошибка сервера');
  }
};
