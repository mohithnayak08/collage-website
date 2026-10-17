const Registration = require('../models/Registration');
const Event = require('../models/Event');
const ExcelJS = require('exceljs');
const { Op } = require('sequelize');

// @desc    Register for an event with payment screenshot
// @route   POST /api/registrations
// @access  Public
const registerForEvent = async (req, res) => {
  try {
    const { eventId, fullName, email, phone, rollNumber } = req.body;

    if (!eventId || !fullName || !email || !phone || !rollNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if duplicate registration
    const existingRegistration = await Registration.findOne({
      where: {
        eventId,
        [Op.or]: [{ email: email.toLowerCase() }, { rollNumber: rollNumber.trim() }],
      },
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: 'A registration with this email or roll number already exists for this event',
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Payment screenshot is required' });
    }

    const paymentScreenshotUrl = `/uploads/${req.file.filename}`;

    const registration = await Registration.create({
      eventId,
      fullName,
      email: email.toLowerCase(),
      phone,
      rollNumber: rollNumber.trim(),
      paymentScreenshotUrl,
    });

    res.status(201).json({
      message: 'Registration submitted successfully!',
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registrations or filter by eventId (admin only)
// @route   GET /api/registrations
// @access  Private
const getRegistrations = async (req, res) => {
  try {
    const { eventId, status } = req.query;
    const where = {};

    if (eventId) where.eventId = eventId;
    if (status && status !== 'all') where.paymentStatus = status;

    const registrations = await Registration.findAll({
      where,
      include: [
        {
          model: Event,
          as: 'event',
          attributes: ['title', 'date', 'venue', 'fee'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update registration payment status (admin only)
// @route   PATCH /api/registrations/:id/status
// @access  Private
const updateRegistrationStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!['pending', 'verified', 'rejected'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const registration = await Registration.findByPk(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.paymentStatus = paymentStatus;
    await registration.save();

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export event registrations to Excel (.xlsx)
// @route   GET /api/registrations/export/:eventId
// @access  Private
const exportRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrations = await Registration.findAll({
      where: { eventId },
      order: [['createdAt', 'ASC']],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registrations');

    worksheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone Number', key: 'phone', width: 18 },
      { header: 'Roll Number / College ID', key: 'rollNumber', width: 25 },
      { header: 'Payment Status', key: 'paymentStatus', width: 15 },
      { header: 'Receipt File Name', key: 'screenshot', width: 35 },
      { header: 'Registration Date', key: 'registeredAt', width: 22 },
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E79' },
    };

    registrations.forEach((reg, index) => {
      worksheet.addRow({
        sno: index + 1,
        fullName: reg.fullName,
        email: reg.email,
        phone: reg.phone,
        rollNumber: reg.rollNumber,
        paymentStatus: reg.paymentStatus.toUpperCase(),
        screenshot: reg.paymentScreenshotUrl.replace('/uploads/', ''),
        registeredAt: new Date(reg.createdAt).toLocaleString(),
      });
    });

    const safeEventTitle = event.title.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${safeEventTitle}_Registrations_${Date.now()}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerForEvent,
  getRegistrations,
  updateRegistrationStatus,
  exportRegistrations,
};
