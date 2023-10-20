const router = require('express').Router();

const {
  login,
  createUser,
  // signout,
} = require('../controllers/users');

const {
  createUserSchema,
  loginSchema,
} = require('../models/validationSchemas');

// POST /signin - авторизация пользователя
router.post('/signin', loginSchema, login);

// POST /signup - регистрация пользователя
router.post('/signup', createUserSchema, createUser);

// POST /signout - выход из системы
// router.post('/signout', signout);

module.exports = router;
