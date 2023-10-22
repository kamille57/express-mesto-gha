const router = require('express').Router();
const { celebrate } = require('celebrate'); // добавляем валидацию через celebrate

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
router.get('/users/:userId', celebrate(getUserByIdSchema), getUser); // используем celebrate для валидации

// Обновить профиль
router.patch('/users/me', celebrate(updateUserProfileSchema), updateProfile); // используем celebrate для валидации

// Обновить аватар
router.patch('/users/me/avatar', celebrate(updateUserAvatarSchema), updateAvatar); // используем celebrate для валидации

module.exports = router;
