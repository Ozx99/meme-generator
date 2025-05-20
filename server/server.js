const express = require('express');
const cors = require('cors');
const memeRoutes = require('./routes/memes');
const sequelize = require('./config/database');

const app = express();

// Test database connection
sequelize.authenticate()
  .then(() => console.log('SQLite connected'))
  .catch((err) => console.error('SQLite connection error:', err));

// Sync models with database
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Database sync error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/memes', memeRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));