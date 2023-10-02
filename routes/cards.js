const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
} = require('../controllers/cards');

// GET /cards - возвращает все карточки
router.get('/cards', getCards);

// POST /cards - создание
router.post('/cards', createCard);

// DELETE /cards/:cardId - удалить карточку
router.delete('/cards/:cardId', deleteCard);

// PUT /cards/:cardId/likes — поставить лайк карточке
router.put('/cards/:cardId/likes', likeCard);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
