/* eslint-disable no-console */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Card = require('../models/card');

// Get all cards
module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
};

// Create a new card
module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id will be accessible
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(400).send({ message: 'Name and link are required' });
  }

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(400).send({ message: 'Invalid data for card creation' }));
};

// удаление карточки
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.send({ message: 'Успешный успех' });
      }
    })
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};

// Add like
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    // проверяем, что id карточки является корректным ObjectId
    return res.status(400).send({ message: 'Некорректный ID карточки' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // add _id to array
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.send({ message: 'Успешный успех' });
    })
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};

// Remove like
module.exports.deleteLike = (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    // проверяем, что id карточки является корректным ObjectId
    return res.status(400).send({ message: 'Некорректный ID карточки' });
  }

  Card.findByIdAndUpdate(cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.send({ message: 'Успешный успех' });
    })
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};
