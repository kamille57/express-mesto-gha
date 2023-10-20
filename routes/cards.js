const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
  createCardSchema,
  likeCardSchema,
  dislikeCardSchema,
  deleteCardSchema,
} = require('../controllers/cards');

// GET /cards - возвращает все карточки
router.get('/cards', getCards);

// POST /cards - создание
router.post('/cards', createCardSchema, createCard);

// DELETE /cards/:cardId - удалить карточку
router.delete('/cards/:cardId', dislikeCardSchema, deleteCard);

// PUT /cards/:cardId/likes — поставить лайк карточке
router.put('/cards/:cardId/likes', likeCardSchema, likeCard);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete('/cards/:cardId/likes', deleteCardSchema, deleteLike);

module.exports = router;
