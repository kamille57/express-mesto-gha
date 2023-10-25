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

const handleError = (error, res, next) => {
  if (error instanceof NotFoundError) {
    return res.status(error.statusCode).json({ message: error.message });
  } return next(error);
};

module.exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await getUserById(userId);
    return res.status(200).send({ data: user });
  } catch (error) {
    return handleError(error, res, next);
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    return handleError(error, res, next);
  }
};

// создание пользователя
module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

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

    return next(err);
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

const updateUserData = async (req, res, next, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return next(error);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  const updateData = { name, about };
  await updateUserData(req, res, next, updateData);
};

module.exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const updateData = { avatar };
  await updateUserData(req, res, next, updateData);
};
