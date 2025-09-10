import * as helpApi from './help.js';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';


// Generate a single UUID v4
const generateSingle = (req, res) => {
  const uuid = uuidv4();
  console.log(`[${new Date().toISOString()}] Generated single UUID v4: ${uuid}`);
  res.send(uuid);
};

// Generate multiple UUID v4s
const generateMultiple = (req, res) => {
  const count = parseInt(req.params.count);
  
  // Validate the count parameter
  if (isNaN(count) || count < 1 || count > 1000) {
    console.log(`[${new Date().toISOString()}] Invalid count parameter: ${req.params.count}`);
    return res.status(400).send(`Count must be a number between 1 and 1000\n${helpApi.helpMessage}`);
  }
  
  // Generate the specified number of UUIDs
  console.log(`[${new Date().toISOString()}] Generating ${count} UUIDs v4`);
  const uuids = Array.from({ length: count }, () => uuidv4());
  res.send(uuids.join('\n'));
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

export {
  generateSingle,
  generateMultiple,
  validate
};
