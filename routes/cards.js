const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
} = require('../controllers/cards');

const {
  createCardSchema,
  likeCardSchema,
  dislikeCardSchema,
  deleteCardSchema,
} = require('../models/validationSchemas');

// GET /cards - возвращает все карточки
router.get('/cards', getCards);

// POST /cards - создание
router.post('/cards', createCardSchema, createCard);

// DELETE /cards/:cardId - удалить карточку
router.delete('/cards/:cardId', deleteCardSchema, deleteCard);

// PUT /cards/:cardId/likes — поставить лайк карточке
router.put('/cards/:cardId/likes', likeCardSchema, likeCard);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete('/cards/:cardId/likes', dislikeCardSchema, deleteLike);

module.exports = router;
