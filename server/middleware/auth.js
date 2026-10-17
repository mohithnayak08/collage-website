const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'college_club_jwt_secret_neon_2026'
      );

      req.admin = await Admin.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });

      if (!req.admin) {
        return res.status(401).json({ message: 'Admin not found, unauthorized' });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }
};

module.exports = { protect };
