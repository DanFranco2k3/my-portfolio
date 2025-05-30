const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/portfolio', {
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

// ✅ Serve static files (CSS, JS, fonts, images)
app.use(express.static(__dirname)); // root (index.html, style.css, script.js)
app.use('/frontend', express.static(path.join(__dirname, 'frontend'))); // serve frontend/pics_file/...

// ✅ Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Form submission handler
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

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
