const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'college_club_jwt_secret_neon_2026', {
    expiresIn: '7d',
  });
};

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const adminExists = await Admin.findOne({
      where: {
        [Op.or]: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
      },
    });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email or username already exists' });
    }

    const admin = await Admin.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });

    res.status(201).json({
      _id: admin.id,
      id: admin.id,
      username: admin.username,
      email: admin.email,
      token: generateToken(admin.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate admin & return token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    const admin = await Admin.findOne({
      where: {
        [Op.or]: [
          { username: username.toLowerCase() },
          { email: username.toLowerCase() },
        ],
      },
    });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin.id,
        id: admin.id,
        username: admin.username,
        email: admin.email,
        token: generateToken(admin.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username/email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ['password'] },
    });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerAdmin, loginAdmin, getMe };
