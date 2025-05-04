// src/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connection is succesful');
  } catch (error) {
    console.error('MongoDB connection is failed', error.message);
    process.exit(1); 
  }
};

export default connectDB;
