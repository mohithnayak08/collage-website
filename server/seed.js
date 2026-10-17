const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Event = require('./models/Event');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Seeding initial data...');

    // 1. Seed Default Admin if none exists
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      await Admin.create({
        username: 'admin',
        email: 'admin@collegeclub.edu',
        password: 'adminpassword123',
      });
      console.log('Admin account created -> User: admin | Pass: adminpassword123');
    } else {
      console.log('Admin user already exists.');
    }

    // 2. Seed Sample Events if none exists
    const eventsCount = await Event.countDocuments();
    if (eventsCount === 0) {
      await Event.create([
        {
          title: 'HackWeb 2026: 24h Hackathon',
          description: 'A 24-hour rapid product design & full-stack development marathon with prizes worth ₹50,000.',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          time: '09:00 AM - 09:00 AM (Next Day)',
          venue: 'Campus Innovation Center, Hall A',
          fee: 250,
          upiId: 'clubevents@okhdfcbank',
        },
        {
          title: 'Introduction to Cloud & DevOps Workshop',
          description: 'Hands-on crash course on containerization, CI/CD, and deploying on modern cloud providers.',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          time: '02:00 PM - 05:30 PM',
          venue: 'Auditorium 2',
          fee: 0,
          upiId: '',
        },
      ]);
      console.log('Sample events seeded successfully.');
    } else {
      console.log('Events already present in database.');
    }

    console.log('Seeding process completed!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedData();
