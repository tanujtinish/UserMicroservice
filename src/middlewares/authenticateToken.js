const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  const secret_key = process.env.SECRET_KEY
  jwt.verify(token, secret_key, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const expirationTimestamp = decodedToken.exp;
    if (Date.now() >= expirationTimestamp * 1000) {
      return res.status(401).json({ message: 'Token expired' });
    }

    req.user = decodedToken.user;
    next();
  });
}

module.exports = authenticateToken;
