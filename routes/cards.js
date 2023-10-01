/* eslint-disable no-console */
const express = require('express');

const router = express.Router();

// GET /cards — возвращает все карточки
router.get('/', (req, res) => {
  res.send('Get all cards');
});

// POST /cards — создаёт карточку
router.post('/', (req, res) => {
  console.log(req.user._id); // _id станет доступен
  res.send('Create card');
});

module.exports = router;
