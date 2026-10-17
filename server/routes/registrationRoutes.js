const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  registerForEvent,
  getRegistrations,
  updateRegistrationStatus,
  exportRegistrations,
} = require('../controllers/registrationController');

// Public registration route with file upload
router.post('/', upload.single('paymentScreenshot'), registerForEvent);

// Admin protected routes
router.get('/', protect, getRegistrations);
router.patch('/:id/status', protect, updateRegistrationStatus);
router.get('/export/:eventId', protect, exportRegistrations);

module.exports = router;
