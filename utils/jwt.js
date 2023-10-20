const jwt = require('jsonwebtoken');

const generateToken = (payload) => jwt.sign(payload, 'secret_code', { expiresIn: '7d' });

module.exports = generateToken;
