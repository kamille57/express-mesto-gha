const router = require('express').Router();

const {
  login,
  createUser,
  // signout,
} = require('../controllers/users');

// POST /signin - авторизация пользователя
router.post('/signin', login);

// POST /signup - регистрация пользователя
router.post('/signup', createUser);

// POST /signout - выход из системы
// router.post('/signout', signout);

module.exports = router;
