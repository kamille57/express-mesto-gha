/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const Card = require('../models/card');

// Get all cards
router.get('/', (req, res) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
});

// Create a new card
router.post('/', (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(400).send({ message: 'Name and link are required' });
  }

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(() => res.status(400).send({ message: 'Invalid data for card creation' }));
});

// Delete a card by id
router.delete('/:cardId', (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'Card not found' });
      }
      res.send({ message: 'Card deleted successfully' });
    })
    .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
});

module.exports = router;
