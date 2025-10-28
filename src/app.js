const express = require('express');
const messageRoutes = require('../src/routes');
const mongoConnector = require('../src/lib/mongodb');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON first

// Mount API routes BEFORE static files
app.use('/api', messageRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, '../public')));

// Fallback for SPA (optional)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Connect to Mongo
mongoConnector.connect()
  .then(() => console.log('MongoDB connection initialized'))
  .catch(err => console.error('Failed to initialize MongoDB connection:', err));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Server listening on ${process.env.PORT || 3000}`);
});
