const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Contact = require('./models/contact');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Check if contact with same email already exists
    const existingContact = await Contact.findOne({ email });

    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'A contact with this email already exists.'
      });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, message: 'Contact saved' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
