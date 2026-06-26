require('dotenv').config(); // Trigger auto-restart
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dbHelper = require('./dbHelper');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes mounting
app.use('/api', apiRouter);

// Database Connection Orchestrator
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vigneshwara-traders';

console.log('Connecting to database...');
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB Database.');
    process.env.USE_FALLBACK = 'false';
    await dbHelper.initializeDefaults();
  })
  .catch(async (err) => {
    console.log('\n*************************************************************************');
    console.log('WARNING: MongoDB connection failed! Falling back to local file persistence.');
    console.log('Please start MongoDB locally or configure MONGODB_URI in your server/.env');
    console.log('Error details:', err.message);
    console.log('*************************************************************************\n');
    
    // Enable local JSON persistence fallback
    process.env.USE_FALLBACK = 'true';
    await dbHelper.initializeDefaults();
  })
  .finally(() => {
    // Start listening once database setup has resolved
    app.listen(PORT, () => {
      console.log(`Vigneshwara Traders Express Backend server running on port: ${PORT}`);
      console.log(`API endpoints accessible at: http://localhost:${PORT}/api`);
    });
  });

// Serve static frontend files from React's client/dist output directory
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Serve static uploaded product images
const uploadsPath = path.join(__dirname, 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Fallback Route to serve SPA index.html for React Routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      // If client build isn't compiled yet, serve a friendly instruction
      res.status(200).send(`
        <body style="font-family: sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 100px 20px;">
          <h1 style="color: #3b82f6;">Vigneshwara Traders API Server</h1>
          <p style="color: #94a3b8;">Backend API is running successfully. React Frontend has not been built yet.</p>
          <p style="color: #64748b; font-size: 0.9rem;">Run <code>npm run dev</code> from the root folder to spin up both React dev server and API server together.</p>
        </body>
      `);
    }
  });
});
