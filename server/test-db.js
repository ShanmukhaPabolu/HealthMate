const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('DB_NAME:', process.env.DB_NAME);

mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME || 'fitness',
})
.then(() => {
  console.log('Successfully connected to MongoDB!');
  process.exit(0);
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});
