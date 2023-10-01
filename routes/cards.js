const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
} = require('../controllers/cards');

// GET /cards - returns all cards
router.get('/cards', getCards);

// POST /cards - creates a card
router.post('/cards', createCard);

// DELETE /cards/:cardId - deletes a card by its identifier
router.delete('/cards/:cardId', deleteCard);

module.exports = router;
