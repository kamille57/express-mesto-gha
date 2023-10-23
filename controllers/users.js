const { ValidationError } = require('mongoose');
const { MongoError } = require('mongodb');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/jwt');
const User = require('../models/user');
const { BadRequestError } = require('../errors/BadRequestError');
const { ConflictError } = require('../errors/ConflictError');
const { NotFoundError } = require('../errors/NotFoundError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const SALT_ROUNDS = 10;

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send({ data: users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Пользователь не найден');
  }
  return user;
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('Пользователь не найден');
  }
  return user.toObject();
};

module.exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await getUserById(userId);
    return res.status(200).send({ data: user });
  } catch (error) {
    return next(error);
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw next(new BadRequestError('Email и пароль обязательны'));
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
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Email и пароль обязательны'));
    } if (error instanceof MongoError && error.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }

    return next(error);
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
    return res.status(200).send({ email, id: user._id });
  } catch (error) {
    return next(error);
  }
};

const updateUserData = async (userId, data, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Invalid data'));
    }
    return next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { name, about } = req.body;
  if (!name || !about) {
    throw new BadRequestError('Name and About fields are required');
  }

  const user = await updateUserData(userId, { name, about }, res, next);

  return res.status(200).json({ name: user.name, about: user.about });
};

module.exports.updateAvatar = async (req, res, next) => {
  const userId = req.user.id;
  const { avatar } = req.body;
  if (!avatar) {
    throw new BadRequestError('Avatar is required');
  }

  const user = await updateUserData(userId, { avatar }, res, next);

  return res.status(200).json({ user });
};
