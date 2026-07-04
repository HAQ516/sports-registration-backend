const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); 
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI ;

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected`);
  } catch (error) {
     console.error(`MongoDB connection error: ${error.message}`);
     return null;
   }
};

module.exports = connectDB;
