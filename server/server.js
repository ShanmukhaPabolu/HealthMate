const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set security headers
app.use(
  helmet({
    contentSecurityPolicy: false // disable for development/Vite integrations
  })
);

// Enable CORS
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  })
);

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Import Route Files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const doctorRoutes = require('./routes/doctor');
const appointmentRoutes = require('./routes/appointment');
const paymentRoutes = require('./routes/payment');
const reviewRoutes = require('./routes/review');
const notificationRoutes = require('./routes/notification');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const disputeRoutes = require('./routes/dispute');
const {
  userTrackerRouter,
  doctorTrackerRouter,
  sharedTrackerRouter
} = require('./routes/tracker');

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // mounts user profile
app.use('/api/doctors', doctorRoutes); // doctor browse/details/register
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/disputes', disputeRoutes);

// Compatibility Tracker Endpoints
app.use('/api/user', userTrackerRouter); // activities, diet, workouts, reminders
app.use('/api/doctor', doctorTrackerRouter); // patients view logs
app.use('/api/shared', sharedTrackerRouter); // askAI, symptoms tracker

// Centralized Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Setup Socket.IO for Live Chat & WebRTC Video signaling
const socketio = require('socket.io');
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Room joining
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit('user-joined', { socketId: socket.id });
  });

  // Real-time Chat Messaging
  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', data);
  });

  // WebRTC Video/Audio Signaling Event Handlers
  socket.on('video-offer', (data) => {
    socket.to(data.roomId).emit('video-offer', data.offer);
  });

  socket.on('video-answer', (data) => {
    socket.to(data.roomId).emit('video-answer', data.answer);
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', data.candidate);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Nodemon environment reload trigger comment
