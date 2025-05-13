const express = require('express');
const morgan = require('morgan');
const v4Api = require('./api/v4');
const v3Api = require('./api/v3');

const app = express();
const port = process.env.PORT || 3000;

// Configure morgan for logging HTTP requests
morgan.token('uuid-request-type', (req) => {
  const path = req.path;
  
  if (path === '/') return 'single-uuid-v4';
  if (path === '/v3') return 'single-uuid-v3';
  if (path.startsWith('/v/')) return 'uuid-validation';
  if (path.startsWith('/v3/v/')) return 'uuid-validation';
  if (path.startsWith('/v4/v/')) return 'uuid-validation';
  
  if (!isNaN(parseInt(path.substring(1)))) {
    return `multiple-uuids-v4:${parseInt(path.substring(1))}`;
  }
  
  if (path.startsWith('/v3/') && !isNaN(parseInt(path.substring(4)))) {
    return `multiple-uuids-v3:${parseInt(path.substring(4))}`;
  }
  
  return 'unknown';
});

// Use both Morgan for HTTP request logging and our custom middleware for detailed logs
app.use(morgan(':remote-addr - :method :url :status :response-time ms - :uuid-request-type'));

// Request logging middleware for detailed application logs
app.use((req, res, next) => {
  const start = Date.now();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // Log request details
  console.log(`[${new Date().toISOString()}] Request: ${req.method} ${req.url} from ${ip}`);
  
  // Log response after it's sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] Response: ${res.statusCode} ${res.statusMessage} - ${duration}ms`);
  });
  
  next();
});

// Middleware to set content type to plain text for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/plain');
  next();
});

// Validation routes (most specific first)
app.get('/v4/v/:uuid', v4Api.validate);
app.get('/v3/v/:uuid', v3Api.validate);
app.get('/v/:uuid', v4Api.validate);

// Explicit version routes
app.get('/v4/:count', v4Api.generateMultiple);
app.get('/v3/:count', v3Api.generateMultiple);
app.get('/v4', v4Api.generateSingle);
app.get('/v3', v3Api.generateSingle);

// Default routes (v4)
app.get('/:count', v4Api.generateMultiple);
app.get('/', v4Api.generateSingle);

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`UUID service running at http://localhost:${port}`);
  });
}

module.exports = app; // Export for testing