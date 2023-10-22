const router = require('express').Router();
const { celebrate } = require('celebrate');

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
router.get('/users/:userId', celebrate({ params: getUserByIdSchema }), getUser);

// Обновить профиль
router.patch('/users/me', celebrate({ body: updateUserProfileSchema }), updateProfile);

// Обновить аватар
router.patch('/users/me/avatar', celebrate({ body: updateUserAvatarSchema }), updateAvatar);

module.exports = router;
