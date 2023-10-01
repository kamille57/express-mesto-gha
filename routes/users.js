const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
} = require('../controllers/users');

// Получить всех пользователей
router.get('/', getUsers);

// Получить пользователя по _id
router.get('/:userId', getUser);

// Создать нового пользователя
router.post('/', createUser);

module.exports = router;
