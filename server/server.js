const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { initSocket } = require('./src/sockets/socket');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Initialize WebSockets
initSocket(server);

// Mount Modular Routes
const portfolioRoutes = require('./src/routes/portfolioRoutes');
const rebalanceRoutes = require('./src/routes/rebalanceRoutes');
const simulateRoutes = require('./src/routes/simulateRoutes');
const aiRoutes = require('./src/routes/aiRoutes');

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/rebalance', rebalanceRoutes);
app.use('/api/simulate', simulateRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'AegisCap Core Orchestration Engine',
    port: process.env.PORT || 5000,
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 [AegisCap Server] RUNNING ON http://localhost:${PORT}`);
  console.log(`📡 WebSockets Active | REST Endpoints Ready`);
  console.log(`====================================================`);
});
