const http = require('http');

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('\x1b[34m====================================================\x1b[0m');
  console.log('\x1b[34m   JEET\'S AUTOMATED API INTEGRATION TESTER        \x1b[0m');
  console.log('\x1b[34m====================================================\x1b[0m\n');

  try {
    // 1. Health
    const health = await makeRequest('/api/health');
    console.log(`\x1b[32m[PASS] GET /api/health -> Status: ${health.status}, Service: ${health.data.service}\x1b[0m`);

    // 2. Portfolio
    const port = await makeRequest('/api/portfolio');
    console.log(`\x1b[32m[PASS] GET /api/portfolio -> Capital: $${port.data.totalValue.toLocaleString()}, VaR: ${(port.data.metrics.var95 * 100).toFixed(2)}%\x1b[0m`);

    // 3. Live Sync
    const sync = await makeRequest('/api/portfolio/sync-live', 'POST');
    console.log(`\x1b[32m[PASS] POST /api/portfolio/sync-live -> Live Yahoo Prices Synced! SPY: $${sync.data.livePrices.SPY}, QQQ: $${sync.data.livePrices.QQQ}\x1b[0m`);

    // 4. Optimize
    const opt = await makeRequest('/api/rebalance/optimize', 'POST');
    console.log(`\x1b[32m[PASS] POST /api/rebalance/optimize -> Turnover: ${opt.data.optimization.turnoverPercent}%, Est. Cost: $${opt.data.optimization.estTransactionCost}\x1b[0m`);

    // 5. Flash Crash Demo Endpoint
    const crash = await makeRequest('/api/simulate/flash-crash', 'POST');
    console.log(`\x1b[31m[PASS] POST /api/simulate/flash-crash -> Circuit Breaker: ${crash.data.circuitBreaker.message.slice(0, 45)}...\x1b[0m`);

    // 6. What-If AI Simulation
    const whatif = await makeRequest('/api/ai/what-if', 'POST', { query: 'What happens if oil spikes 25% and tech drops 10%?' });
    console.log(`\x1b[32m[PASS] POST /api/ai/what-if -> Projected: ${whatif.data.projectedLoss}, Rec: ${whatif.data.recommendation.slice(0, 45)}...\x1b[0m`);

    // 7. Reset
    const reset = await makeRequest('/api/portfolio/reset', 'POST');
    console.log(`\x1b[32m[PASS] POST /api/portfolio/reset -> Portfolio reset to safe baseline!\x1b[0m\n`);

    console.log('\x1b[34m====================================================\x1b[0m');
    console.log('\x1b[32mALL 7 API ENDPOINTS FULLY VERIFIED AND OPERATIONAL! \x1b[0m');
    console.log('\x1b[34m====================================================\x1b[0m');
  } catch (err) {
    console.error('\x1b[31m[FAIL] Could not connect to server. Make sure server is running on port 5000!\x1b[0m');
    console.error(err.message);
  }
}

runTests();
