const router = require('express').Router();
const { celebrate } = require('celebrate');

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
router.post('/cards', celebrate(createCardSchema), createCard);

// DELETE /cards/:cardId - удалить карточку
router.delete('/cards/:cardId', celebrate(deleteCardSchema), deleteCard);

// PUT /cards/:cardId/likes — поставить лайк карточке
router.put('/cards/:cardId/likes', celebrate(likeCardSchema), likeCard);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete('/cards/:cardId/likes', celebrate(dislikeCardSchema), deleteLike);

module.exports = router;
