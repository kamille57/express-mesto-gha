/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const User = require('../models/user');

// Get all users
router.get('/users', (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
});

// Get user by _id
router.get('/users/:userId', (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.send(user);
    })
    .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
});

// Create a new user
router.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Name, about, and avatar are required' });
  }

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(400).send({ message: 'Invalid data for user creation' }));
});

module.exports = router;
