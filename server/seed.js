const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const User = require('./models/User');
const Doctor = require('./models/Doctor');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'fitness',
    });
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users/doctors if needed, or check if they exist
    await User.deleteMany({ email: { $in: ['admin@healthtracker.com', 'doctor@healthtracker.com', 'patient@healthtracker.com', 'shanmukharani20@gmail.com'] } });

    // 1. Create Patient
    const patientUser = await User.create({
      name: 'John Doe',
      email: 'patient@healthtracker.com',
      password: 'password123',
      role: 'patient',
      phone: '1234567890',
      gender: 'Male',
      address: '123 Main St, New York',
      healthProfile: {
        bloodGroup: 'O+',
        allergies: 'Peanuts',
        chronicConditions: 'None',
        emergencyContact: {
          name: 'Jane Doe',
          phone: '9876543210',
          relationship: 'Spouse'
        }
      }
    });
    console.log('Patient user created.');

    // 2. Create Doctor
    const doctorUser = await User.create({
      name: 'Sarah Connor',
      email: 'doctor@healthtracker.com',
      password: 'password123',
      role: 'doctor',
      phone: '5551234567',
      gender: 'Female',
      address: '456 Clinic Ave, Los Angeles'
    });

    const doctorProfile = await Doctor.create({
      user: doctorUser._id,
      specialization: 'Cardiologist',
      qualification: 'MD, FACC',
      experience: 12,
      consultationFee: 100,
      hospital: 'Metro Cardiac Center, LA',
      bio: 'Dr. Sarah Connor is a senior cardiologist specializing in cardiovascular diseases with over 12 years of hands-on surgery experience.',
      languages: ['English', 'Spanish'],
      approved: true, // Auto-approved for seed data
      slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
    });
    console.log('Doctor user and profile created.');

    // 3. Create Admin
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'shanmukharani20@gmail.com',
      password: 'password123',
      role: 'admin',
      phone: '9999999999'
    });
    console.log('Admin user created.');

    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
