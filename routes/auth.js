const router = require('express').Router();

const {
  login,
  createUser,
  createUserSchema,
  loginSchema,
  // signout,
} = require('../controllers/users');

// POST /signin - авторизация пользователя
router.post('/signin', loginSchema, login);

// POST /signup - регистрация пользователя
router.post('/signup', createUserSchema, createUser);

// POST /signout - выход из системы
// router.post('/signout', signout);

module.exports = router;
