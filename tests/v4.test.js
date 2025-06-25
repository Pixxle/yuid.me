const request = require('supertest');
const { validate: uuidValidate } = require('uuid');
const app = require('../index');

describe('UUID v4 API', () => {
  // Test for generating a single UUID (default v4)
  test('GET / should return a valid UUID v4', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(uuidValidate(response.text)).toBe(true);
  });

  // Test explicit v4 endpoint
  test('GET /v4 should return a valid UUID v4', async () => {
    const response = await request(app).get('/v4');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(uuidValidate(response.text)).toBe(true);
  });

  // Test for generating multiple UUIDs (default v4)
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

  // Test explicit v4 multiple endpoint
  test('GET /v4/10 should return 10 valid UUIDs', async () => {
    const response = await request(app).get('/v4/10');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    
    const uuids = response.text.split('\n');
    expect(uuids.length).toBe(10);
    
    uuids.forEach(uuid => {
      expect(uuidValidate(uuid)).toBe(true);
    });
  });

  // Test for validating a valid UUID (default endpoint)
  test('GET /v/{valid-uuid} should validate a valid UUID', async () => {
    // First get a valid UUID from the API
    const uuidResponse = await request(app).get('/');
    const uuid = uuidResponse.text;

    const response = await request(app).get(`/v/${uuid}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`VALID`);
  });

  // Test for validating a valid UUID (explicit v4 endpoint)
  test('GET /v4/v/{valid-uuid} should validate a valid UUID', async () => {
    // First get a valid UUID from the API
    const uuidResponse = await request(app).get('/v4');
    const uuid = uuidResponse.text;

    const response = await request(app).get(`/v4/v/${uuid}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`VALID`);
  });

  // Test for validating an invalid UUID (default endpoint)
  test('GET /v/{invalid-uuid} should return an error for invalid UUID', async () => {
    const invalidUuid = 'not-a-uuid';
    const response = await request(app).get(`/v/${invalidUuid}`);

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`INVALID`);
  });

  // Test for validating an invalid UUID (explicit v4 endpoint)
  test('GET /v4/v/{invalid-uuid} should return an error for invalid UUID', async () => {
    const invalidUuid = 'not-a-uuid';
    const response = await request(app).get(`/v4/v/${invalidUuid}`);

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`INVALID`);
  });

  // Test for invalid count parameter (default endpoint)
  test('GET /invalid should return an error for invalid count', async () => {
    const response = await request(app).get('/invalid');

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`Count must be a number between 1 and 1000
Usage:
    GET /               - Returns a single V4 UUID
    GET /<count>        - Returns <count> V4 UUIDS. Up to 1000
    GET /v/<UUID>       - Validates UUID, returns VALID or INVALID in body

    GET /v3/            - Returns a single V3 UUID
    GET /v3/<count>     - Returns <count> V3 UUIDS. Up to 1000
    GET /v3/v/<UUID>    - Validates V3 UUID, returns VALID or INVALID in body

    GET /v4/            - Returns a single V4 UUID
    GET /v4/<count>     - Returns <count> V4 UUIDS. Up to 1000
    GET /v4/v/<UUID>    - Validates V4 UUID, returns VALID or INVALID in body
    
`);
  });

  // Test for invalid count parameter (explicit v4 endpoint)
  test('GET /v4/invalid should return an error for invalid count', async () => {
    const response = await request(app).get('/v4/invalid');

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`Count must be a number between 1 and 1000
Usage:
    GET /               - Returns a single V4 UUID
    GET /<count>        - Returns <count> V4 UUIDS. Up to 1000
    GET /v/<UUID>       - Validates UUID, returns VALID or INVALID in body

    GET /v3/            - Returns a single V3 UUID
    GET /v3/<count>     - Returns <count> V3 UUIDS. Up to 1000
    GET /v3/v/<UUID>    - Validates V3 UUID, returns VALID or INVALID in body

    GET /v4/            - Returns a single V4 UUID
    GET /v4/<count>     - Returns <count> V4 UUIDS. Up to 1000
    GET /v4/v/<UUID>    - Validates V4 UUID, returns VALID or INVALID in body
    
`);
  });

  // Test for count limits (default endpoint)
  test('GET /2000 should return an error for count > 1000', async () => {
    const response = await request(app).get('/2000');
    
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`Count must be a number between 1 and 1000
Usage:
    GET /               - Returns a single V4 UUID
    GET /<count>        - Returns <count> V4 UUIDS. Up to 1000
    GET /v/<UUID>       - Validates UUID, returns VALID or INVALID in body

    GET /v3/            - Returns a single V3 UUID
    GET /v3/<count>     - Returns <count> V3 UUIDS. Up to 1000
    GET /v3/v/<UUID>    - Validates V3 UUID, returns VALID or INVALID in body

    GET /v4/            - Returns a single V4 UUID
    GET /v4/<count>     - Returns <count> V4 UUIDS. Up to 1000
    GET /v4/v/<UUID>    - Validates V4 UUID, returns VALID or INVALID in body
    
`);
  });

  // Test for count limits (explicit v4 endpoint)
  test('GET /v4/2000 should return an error for count > 1000', async () => {
    const response = await request(app).get('/v4/2000');
    
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`Count must be a number between 1 and 1000
Usage:
    GET /               - Returns a single V4 UUID
    GET /<count>        - Returns <count> V4 UUIDS. Up to 1000
    GET /v/<UUID>       - Validates UUID, returns VALID or INVALID in body

    GET /v3/            - Returns a single V3 UUID
    GET /v3/<count>     - Returns <count> V3 UUIDS. Up to 1000
    GET /v3/v/<UUID>    - Validates V3 UUID, returns VALID or INVALID in body

    GET /v4/            - Returns a single V4 UUID
    GET /v4/<count>     - Returns <count> V4 UUIDS. Up to 1000
    GET /v4/v/<UUID>    - Validates V4 UUID, returns VALID or INVALID in body
    
`);
  });
});
