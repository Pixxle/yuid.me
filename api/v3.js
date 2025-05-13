const { v3: uuidv3, validate: uuidValidate } = require('uuid');

// Default namespace for UUID v3 (using DNS namespace)
const DEFAULT_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // DNS namespace

// Generate a single UUID v3
const generateSingle = (req, res) => {
  const name = req.query.name || new Date().toISOString();
  const namespace = req.query.namespace || DEFAULT_NAMESPACE;
  
  try {
    const uuid = uuidv3(name, namespace);
    console.log(`[${new Date().toISOString()}] Generated single UUID v3: ${uuid} (name: ${name})`);
    res.send(uuid);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error generating UUID v3: ${error.message}`);
    res.status(400).send(`Error: ${error.message}`);
  }
};

// Generate multiple UUID v3s
const generateMultiple = (req, res) => {
  const count = parseInt(req.params.count);
  const baseName = req.query.name || 'uuid';
  const namespace = req.query.namespace || DEFAULT_NAMESPACE;
  
  // Validate the count parameter
  if (isNaN(count) || count < 1 || count > 1000) {
    console.log(`[${new Date().toISOString()}] Invalid count parameter: ${req.params.count}`);
    return res.status(400).send('Count must be a number between 1 and 1000');
  }
  
  try {
    // Generate the specified number of UUIDs
    console.log(`[${new Date().toISOString()}] Generating ${count} UUIDs v3`);
    const uuids = Array.from({ length: count }, (_, i) => 
      uuidv3(`${baseName}-${i}-${Date.now()}`, namespace)
    );
    res.send(uuids.join('\n'));
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error generating UUID v3: ${error.message}`);
    res.status(400).send(`Error: ${error.message}`);
  }
};

// Validate UUID (works for any version)
const validate = (req, res) => {
  const uuid = req.params.uuid;
  const isValid = uuidValidate(uuid);
  
  console.log(`[${new Date().toISOString()}] UUID validation: ${uuid} - ${isValid ? 'VALID' : 'INVALID'}`);
  
  if (isValid) {
    res.send(`VALID`);
  } else {
    res.status(400).send(`INVALID`);
  }
};

module.exports = {
  generateSingle,
  generateMultiple,
  validate
};
