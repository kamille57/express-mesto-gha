const express = require('express');

const router = express.Router();

// GET /users — возвращает всех пользователей
router.get('/', (req, res) => {
  res.send('Get all users');
});

// GET /users/:userId — возвращает пользователя по _id
router.get('/:userId', (req, res) => {
  res.send(`Get user by id: ${req.params.userId}`);
});

// POST /users — создаёт пользователя
router.post('/', (req, res) => {
  res.send('Create user');
});

module.exports = router;
