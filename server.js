const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// ✅ Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
    console.log('📄 Loaded .env file for development');
  } catch (err) {
    console.log('ℹ️ No dotenv package found - using environment variables directly');
  }
}

const app = express();

// ✅ Process error handlers
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Promise Rejection:', err);
  process.exit(1);
});

// ✅ Debug environment variables
console.log('🔍 Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);

// ✅ Validate MongoDB URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

if (!process.env.MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI not found in environment variables! Using fallback.');
}

// ✅ Enhanced MongoDB connection with error handling
console.log('🔗 Attempting to connect to MongoDB...');
console.log('Connection type:', mongoURI.startsWith('mongodb+srv') ? 'Atlas' : 'Local');

// ✅ Connection event handlers
mongoose.connection.on('connecting', () => {
  console.log('🔄 Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// ✅ Connect with timeout and retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      retryWrites: true,
    });
  } catch (error) {
    console.error('❌ Initial MongoDB connection failed:', error.message);
    
    // Additional debugging info
    if (error.name === 'MongoServerSelectionError') {
      console.error('🔍 Server selection failed - possible causes:');
      console.error('  • Wrong connection string');
      console.error('  • Network/firewall issues');
      console.error('  • MongoDB server not running');
      console.error('  • IP not whitelisted (for Atlas)');
    }
    
    // For production, we might want to retry, but for now just exit
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    } else {
      throw error;
    }
  }
};

// ✅ Start connection
connectWithRetry();

// ✅ Define Mongoose schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ✅ Serve static files
app.use(express.static(__dirname));
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

// ✅ Health check route with detailed info
app.get('/health', (req, res) => {
  const connectionStates = {
    0: 'Disconnected',
    1: 'Connected', 
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: {
      state: connectionStates[mongoose.connection.readyState],
      stateCode: mongoose.connection.readyState
    },
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// ✅ Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Form submission route with validation
app.post('/submit', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).send('All fields are required');
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    
    console.log('✅ Message saved successfully:', { name, email });
    res.send('<script>alert("Message received! Thanks!"); window.location.href="/";</script>');
  } catch (error) {
    console.error('❌ Error saving message:', error);
    res.status(500).send(`Error saving message: ${error.message}`);
  }
});

// ✅ Test database route with detailed diagnostics
app.get('/test-db', async (req, res) => {
  try {
    // Check connection state
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        status: 'error',
        message: 'Database not connected',
        connectionState: mongoose.connection.readyState
      });
    }

    const messages = await Message.find().sort({ createdAt: -1 }).limit(10);
    
    res.json({
      status: 'success',
      message: `MongoDB is working. ${messages.length} message(s) found.`,
      connectionState: mongoose.connection.readyState,
      totalMessages: await Message.countDocuments(),
      recentMessages: messages.map(msg => ({
        name: msg.name,
        email: msg.email,
        createdAt: msg.createdAt
      }))
    });
  } catch (error) {
    console.error('❌ Database test failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'MongoDB query failed: ' + error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Express error:', err);
  res.status(500).send('Something went wrong!');
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 DB test: http://localhost:${PORT}/test-db`);
});

// ✅ Handle server errors
server.on('error', (err) => {
  console.error('💥 Server error:', err);
});