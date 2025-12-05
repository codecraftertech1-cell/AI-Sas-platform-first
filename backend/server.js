const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const documentRoutes = require('./routes/documents');
const presentationRoutes = require('./routes/presentations');
const websiteRoutes = require('./routes/websites');
const mobileAppRoutes = require('./routes/mobileApps');
const subscriptionRoutes = require('./routes/subscriptions');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const mediaRoutes = require('./routes/media');
const linkedinRoutes = require('./routes/linkedin');
const socialMediaRoutes = require('./routes/socialMedia');
const emailRoutes = require('./routes/email');
const storageRoutes = require('./routes/storage');
const callAgentRoutes = require('./routes/callAgent');
const agentsRoutes = require('./routes/agents');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/documents', authenticateToken, documentRoutes);
app.use('/api/presentations', authenticateToken, presentationRoutes);
app.use('/api/websites', authenticateToken, websiteRoutes);
app.use('/api/mobile-apps', authenticateToken, mobileAppRoutes);
app.use('/api/subscriptions', authenticateToken, subscriptionRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/media', authenticateToken, mediaRoutes);
app.use('/api/linkedin', authenticateToken, linkedinRoutes);
app.use('/api/social-media', authenticateToken, socialMediaRoutes);
app.use('/api/social', authenticateToken, socialMediaRoutes); // Alias
app.use('/api/email', authenticateToken, emailRoutes);
app.use('/api/storage', authenticateToken, storageRoutes);
app.use('/api/call', authenticateToken, callAgentRoutes);
app.use('/api/agents', authenticateToken, agentsRoutes);
// PDF endpoints (aliases)
app.use('/api/files', authenticateToken, documentRoutes);
app.use('/api/pdf', authenticateToken, documentRoutes);
// Video endpoints (aliases)
app.use('/api/video', authenticateToken, mediaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  
  // If response already sent (streaming), don't send error
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

