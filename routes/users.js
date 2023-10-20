const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  getUserByIdSchema,
  updateUserProfileSchema,
  updateUserAvatarSchema,
} = require('../models/validationSchemas');

// Получить всех пользователей
router.get('/users', getUsers);

// Получить пользователя по _id
router.get('/users/:userId', getUserByIdSchema, getUser);

// Обновить профиль
router.patch('/users/me', updateUserProfileSchema, updateProfile);

// Обновить аватар
router.patch('/users/me/avatar', updateUserAvatarSchema, updateAvatar);

module.exports = router;
