/* eslint-disable no-console */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Card = require('../models/card');
const { BadRequestError } = require('../errors/BadRequestError');
const { InternalServerError } = require('../errors/InternalServerError');
const { NotFoundError } = require('../errors/NotFoundError');

// Get all cards
module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    res.status(200).send({ data: cards });
  } catch (error) {
    next(error);
  }
};

// Create a new card
module.exports.createCard = async (req, res, next) => {
  try {
    console.log(req.user._id); // _id будет доступен
    const { name, link } = req.body;

    if (!name || !link) {
      return res.status(400).send({ message: 'Name and link are required' });
    }

    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).send({ data: card });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(error.message));
    } else {
      next(new InternalServerError('Server error occurred'));
    }
  }
};

// Delete card
module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new BadRequestError('Invalid card ID');
    }

    const card = await Card.findByIdAndRemove(cardId);

    if (!card) {
      throw new NotFoundError('Card not found');
    }

    res.status(200).send({ data: card });
  } catch (error) {
    next(error);
  }
};

// Add like
module.exports.likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new BadRequestError('Invalid card ID');
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Card not found');
    }

    res.status(200).send({ data: card });
  } catch (error) {
    next(error);
  }
};

// Remove like
module.exports.deleteLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new BadRequestError('Invalid card ID');
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Card not found');
    }

    res.status(200).send({ data: card });
  } catch (error) {
    next(error);
  }
};
