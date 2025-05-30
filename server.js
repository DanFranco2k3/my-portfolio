const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load .env file

const app = express();

// ✅ Use MONGODB_URI from .env or fallback to local
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Define Mongoose schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Message = mongoose.model('Message', messageSchema);

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve static files (CSS, JS, images, fonts)
app.use(express.static(__dirname));
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

// ✅ Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Form submission route
app.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.send('<script>alert("Message received! Thanks!"); window.location.href="/";</script>');
  } catch (error) {
    console.error('❌ Error saving message:', error);
    res.status(500).send('Error saving message.');
  }
});

// ✅ Optional: test-db route
app.get('/test-db', async (req, res) => {
  try {
    const messages = await Message.find();
    res.send(`✅ MongoDB is working. ${messages.length} message(s) found.`);
  } catch (error) {
    res.status(500).send('❌ MongoDB query failed: ' + error.message);
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
