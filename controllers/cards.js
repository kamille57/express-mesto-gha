/* eslint-disable no-console */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Card = require('../models/card');
const { BadRequestError } = require('../errors/BadRequestError');
const { InternalServerError } = require('../errors/InternalServerError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/Forbidden');

// Получить все карточки
module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    if (!cards) {
      throw new NotFoundError('Карточки не найдены');
    }
    res.status(200).send({ data: cards });
  } catch (error) {
    next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  console.log(req.body);
  if (!name || !link) {
    throw new BadRequestError('Имя и ссылка - необходимые поля');
  }
  try {
    console.log(req.user.id); // _id будет доступен

    const card = await Card.create({ name, link, owner: req.user.id });
    res.status(201).send({ data: card });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Неверный ID карточки'));
    } else {
      next(new InternalServerError());
    }
  }
};

// Удалить карточку
module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { userId } = req.user; // Идентификатор текущего пользователя

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new BadRequestError('Неверный ID карточки');
    }

    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    if (card.userId !== userId) { // Проверка, что карточка принадлежит текущему пользователю
      throw new ForbiddenError('У вас нет доступа к этой карточке');
    }

    await Card.findByIdAndRemove(cardId);

    res.status(200).send({ data: card });
  } catch (error) {
    next(error);
  }
};

// Добавить лайк
module.exports.likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new BadRequestError('Неверный ID карточки');
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.status(200).send({ data: card.likes });
  } catch (error) {
    next(error);
  }
};

// Удалить лайк
module.exports.deleteLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      throw new BadRequestError('Неверный ID карточки');
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.status(200).send({ data: card.likes }); // исправление: возвращаем только список лайков
  } catch (error) {
    next(error);
  }
};
