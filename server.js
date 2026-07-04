const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables before importing the app
dotenv.config();

const app = require('./src/app');

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
