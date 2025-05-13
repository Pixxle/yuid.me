const express = require('express');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to set content type to plain text for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/plain');
  next();
});

// Generate a single UUID
app.get('/', (req, res) => {
  res.send(uuidv4());
});

// Generate multiple UUIDs
app.get('/:count', (req, res) => {
  const count = parseInt(req.params.count);
  
  // Validate the count parameter
  if (isNaN(count) || count < 1 || count > 1000) {
    return res.status(400).send('Count must be a number between 1 and 1000');
  }
  
  // Generate the specified number of UUIDs
  const uuids = Array.from({ length: count }, () => uuidv4());
  res.send(uuids.join('\n'));
});

// Validate UUID
app.get('/v/:uuid', (req, res) => {
  const uuid = req.params.uuid;
  const isValid = uuidValidate(uuid);
  
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
