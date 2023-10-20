const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getUserByIdSchema,
  updateUserProfileSchema,
  updateUserAvatarSchema,
} = require('../controllers/users');

// Получить всех пользователей
router.get('/users', getUsers);

// Получить пользователя по _id
router.get('/users/:userId', getUserByIdSchema, getUser);

// Обновить профиль
router.patch('/users/me', updateUserProfileSchema, updateProfile);

// Обновить аватар
router.patch('/users/me/avatar', updateUserAvatarSchema, updateAvatar);

module.exports = router;
