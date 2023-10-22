const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/jwt');
const User = require('../models/user');
const { BadRequestError } = require('../errors/BadRequestError');
const { ConflictError } = require('../errors/ConflictError');
const { InternalServerError } = require('../errors/InternalServerError');
const { NotFoundError } = require('../errors/NotFoundError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const SALT_ROUNDS = 10;

module.exports.getUsers = async (req, res, next) => {
  try {
    // Проверяем, авторизован ли пользователь
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }

    const users = await User.find();
    res.status(200).send({ data: users });
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Некорректный Id пользователя');
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.status(200).send({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Email и пароль обязательны'));
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

    return res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Email и пароль обязательны'));
    } if (err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(new InternalServerError('Ошибка сервера'));
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }

    const isValidPassword = await bcrypt.compare(String(password), user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }

    const token = generateToken({ id: user._id });
    res.cookie('mestoToken', token, { maxAge: 3600000000, httpOnly: true, sameSite: true });
    return res.status(201).send({ email, id: user._id });
  } catch (error) {
    return next(error);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const userId = req.user.id; // Change req.user.id to req.user._id
  console.log('нужно тут', userId);
  const { name, about } = req.body;
  console.log({ name, about });
  try {
    if (!name || !about) {
      throw new BadRequestError('Name and About fields are required');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return res.status(200).send({ name, about });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Name and About fields are required'));
    }
    return next(new InternalServerError('Internal server error'));
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  const userId = req.user.id;
  const { avatar } = req.body;

  try {
    if (!avatar) {
      throw new BadRequestError('Avatar is required');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return res.status(200).send({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Avatar is required'));
    }
    return next(new InternalServerError('Internal server error'));
  }
};
