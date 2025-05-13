const express = require('express');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

// Configure morgan for logging HTTP requests
morgan.token('uuid-request-type', (req) => {
  if (req.path === '/') return 'single-uuid';
  if (req.path.startsWith('/v/')) return 'uuid-validation';
  if (!isNaN(parseInt(req.path.substring(1)))) return `multiple-uuids:${parseInt(req.path.substring(1))}`;
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

// Generate a single UUID
app.get('/', (req, res) => {
  const uuid = uuidv4();
  console.log(`[${new Date().toISOString()}] Generated single UUID: ${uuid}`);
  res.send(uuid);
});

// Generate multiple UUIDs
app.get('/:count', (req, res) => {
  const count = parseInt(req.params.count);
  
  // Validate the count parameter
  if (isNaN(count) || count < 1 || count > 1000) {
    console.log(`[${new Date().toISOString()}] Invalid count parameter: ${req.params.count}`);
    return res.status(400).send('Count must be a number between 1 and 1000');
  }
  
  // Generate the specified number of UUIDs
  console.log(`[${new Date().toISOString()}] Generating ${count} UUIDs`);
  const uuids = Array.from({ length: count }, () => uuidv4());
  res.send(uuids.join('\n'));
});

// Validate UUID
app.get('/v/:uuid', (req, res) => {
  const uuid = req.params.uuid;
  const isValid = uuidValidate(uuid);
  
  console.log(`[${new Date().toISOString()}] UUID validation: ${uuid} - ${isValid ? 'VALID' : 'INVALID'}`);
  
  if (isValid) {
    res.send(`VALID`);
  } else {
    res.status(400).send(`INVALID`);
  }
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`UUID service running at http://localhost:${port}`);
  });
}

module.exports = app; // Export for testing
