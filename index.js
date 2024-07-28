const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
}));

// MongoDB Connection
mongoose.connect(process.env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Models
const User = require('./models/User');
const Note = require('./models/Note');

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/notes', require('./routes/notes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
