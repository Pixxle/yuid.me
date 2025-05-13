const request = require('supertest');
const { validate: uuidValidate } = require('uuid');
const app = require('../index');

describe('UUID API', () => {
  // Test for generating a single UUID
  test('GET / should return a valid UUID', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(uuidValidate(response.text)).toBe(true);
  });

  // Test for generating multiple UUIDs
  test('GET /10 should return 10 valid UUIDs', async () => {
    const response = await request(app).get('/10');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    
    const uuids = response.text.split('\n');
    expect(uuids.length).toBe(10);
    
    uuids.forEach(uuid => {
      expect(uuidValidate(uuid)).toBe(true);
    });
  });

  // Test for validating a valid UUID
  test('GET /v/{valid-uuid} should validate a valid UUID', async () => {
    // First get a valid UUID from the API
    const uuidResponse = await request(app).get('/');
    const uuid = uuidResponse.text;

    const response = await request(app).get(`/v/${uuid}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`VALID`);
  });

  // Test for validating an invalid UUID
  test('GET /v/{invalid-uuid} should return an error for invalid UUID', async () => {
    const invalidUuid = 'not-a-uuid';
    const response = await request(app).get(`/v/${invalidUuid}`);

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`INVALID`);
  });

  // Test for invalid count parameter
  test('GET /invalid should return an error for invalid count', async () => {
    const response = await request(app).get('/invalid');

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe('Count must be a number between 1 and 1000');
  });

  // Test for count limits
  test('GET /2000 should return an error for count > 1000', async () => {
    const response = await request(app).get('/2000');
    
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe('Count must be a number between 1 and 1000');
  });
});
