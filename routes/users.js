const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// Получить всех пользователей
router.get('/users', getUsers);

// Получить пользователя по _id
router.get('/users/:userId', getUser);

// Обновить профиль
router.patch('/users/me', updateProfile);

// Обновить аватар
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
