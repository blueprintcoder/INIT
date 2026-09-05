const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { initSocket } = require('./src/sockets/socket');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// Initialize WebSockets
initSocket(server);

// Routes
const portfolioRoutes = require('./src/routes/portfolioRoutes');
const rebalanceRoutes = require('./src/routes/rebalanceRoutes');
const simulateRoutes = require('./src/routes/simulateRoutes');

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/rebalance', rebalanceRoutes);
app.use('/api/simulate', simulateRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', service: 'AegisCap Core Engine', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[AegisCap Server] Running on http://localhost:${PORT}`);
});
