const express = require('express');

const router = express.Router();
const cookieParser = require('cookie-parser');
const auth = require('./auth');
const authMiddleware = require('../middlewares/authMiddleware');
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use(cookieParser());
router.use(express.json());

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use(auth);
router.use(authMiddleware);

module.exports = router;
