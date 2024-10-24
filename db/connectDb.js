import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/chai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`); // Corrected here
  } catch (error) {
    console.error(`Error: ${error.message}`); // Added more detail to the error logging
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;

