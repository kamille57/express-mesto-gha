/* eslint-disable no-console */
/* eslint-disable consistent-return */
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

// Delete a card by id
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'Card not found' });
      }
      res.send({ message: 'Card deleted successfully' });
    })
    .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
};
