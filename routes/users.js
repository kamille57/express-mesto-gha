const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// Получить всех пользователей
router.get('/users', getUsers);

// Получить пользователя по _id
router.get('/users/:userId', getUser);

// Создать нового пользователя
router.post('/users', createUser);

// Обновить профиль
router.patch('/users/me', updateProfile);

// Обновить аватар
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
