/* eslint-disable no-console */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Card = require('../models/card');

// Get all cards
module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: 'Internal Server Error', error: err }));
};

// Create a new card
module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id будет доступен
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(400).send({ message: 'Name and link are required' });
  }

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server error occurred', error: err });
    });
};

// Delete card
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: 'Invalid card ID' });
  }

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }

      // Проверяем, является ли текущий пользователь владельцем карточки
      if (card.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: 'Forbidden' });
      }

      Card.findByIdAndRemove(cardId)
        .then((deletedCard) => {
          res.status(200).send({ data: deletedCard });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Internal Server Error', error: err });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Internal Server Error', error: err });
    });
};

// Add like
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: 'Invalid card ID' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: 'Internal Server Error', error: err }));
};

// Remove like
module.exports.deleteLike = (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: 'Invalid card ID' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: 'Internal Server Error', error: err }));
};
