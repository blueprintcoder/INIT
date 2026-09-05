// Aniket's Seeder Script: Seeds $10M Initial Balance Sheet
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Portfolio = require('./Portfolio');
const RiskPolicy = require('./RiskPolicy');

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aegiscap';
    await mongoose.connect(uri);
    console.log('[Seeder] Connected to MongoDB.');

    await Portfolio.deleteMany({});
    await RiskPolicy.deleteMany({});

    await RiskPolicy.create({
      minCashBufferPercent: 0.15,
      maxSingleAssetCap: 0.25,
      maxAllowableVaR95: 0.040,
      tier2BreakerTriggerVaR: 0.050
    });

    await Portfolio.create({
      name: 'Primary Corporate Treasury',
      totalValue: 10000000,
      cashBuffer: 1500000,
      activeMode: 'ADVISORY',
      metrics: {
        sharpeRatio: 1.85,
        var95: 0.024,
        cvar95: 0.038,
        status: 'HEALTHY'
      },
      holdings: [
        { symbol: 'SPY', name: 'S&P 500 ETF', assetClass: 'EQUITY', weight: 0.25, targetWeight: 0.25, value: 2500000, currentPrice: 510, volatility: 0.16 },
        { symbol: 'QQQ', name: 'Tech Growth ETF', assetClass: 'EQUITY', weight: 0.20, targetWeight: 0.20, value: 2000000, currentPrice: 440, volatility: 0.22 },
        { symbol: 'IEF', name: '10Y US Treasury', assetClass: 'FIXED_INCOME', weight: 0.25, targetWeight: 0.25, value: 2500000, currentPrice: 94, volatility: 0.07 },
        { symbol: 'LQD', name: 'Corporate Bonds', assetClass: 'FIXED_INCOME', weight: 0.15, targetWeight: 0.15, value: 1500000, currentPrice: 108, volatility: 0.09 },
        { symbol: 'USD', name: 'Cash Reserve', assetClass: 'CASH', weight: 0.15, targetWeight: 0.15, value: 1500000, currentPrice: 1.0, volatility: 0.00 }
      ]
    });

    console.log('[Seeder] Initial $10M Portfolio & Policy successfully seeded!');
    process.exit(0);
  } catch (err) {
    console.error('[Seeder Error]', err);
    process.exit(1);
  }
};

seedData();
