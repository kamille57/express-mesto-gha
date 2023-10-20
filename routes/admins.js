const router = require('express').Router();

const {
  login,
  createUser,
} = require('../controllers/users');

// POST /signin - авторизация пользователя
router.post('/signin', login);

// POST /signup - регистрация пользователя
router.post('/signup', createUser);

module.exports = router;
