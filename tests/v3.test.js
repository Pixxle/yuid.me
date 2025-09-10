import request from 'supertest';
import { validate as uuidValidate, v3 as uuidv3 } from 'uuid';
import app from '../index.js';

describe('UUID v3 API', () => {
  // Test for generating a single UUID v3
  test('GET /v3 should return a valid UUID v3', async () => {
    const response = await request(app).get('/v3');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(uuidValidate(response.text)).toBe(true);
  });

  // Test for generating a single UUID v3 with custom name
  test('GET /v3?name=test should return a deterministic UUID v3', async () => {
    const response1 = await request(app).get('/v3?name=test');
    const response2 = await request(app).get('/v3?name=test');
    
    expect(response1.status).toBe(200);
    expect(response1.headers['content-type']).toMatch(/text\/plain/);
    expect(uuidValidate(response1.text)).toBe(true);
    
    // UUID v3 should be deterministic for the same name and namespace
    expect(response1.text).toBe(response2.text);
  });

  // Test for generating multiple UUIDs v3
  test('GET /v3/10 should return 10 valid UUIDs', async () => {
    const response = await request(app).get('/v3/10');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    
    const uuids = response.text.split('\n');
    expect(uuids.length).toBe(10);
    
    uuids.forEach(uuid => {
      expect(uuidValidate(uuid)).toBe(true);
    });
  });

  // Test for generating multiple UUIDs v3 with custom name base
  test('GET /v3/5?name=custom should return 5 valid UUIDs', async () => {
    const response = await request(app).get('/v3/5?name=custom');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    
    const uuids = response.text.split('\n');
    expect(uuids.length).toBe(5);
    
    uuids.forEach(uuid => {
      expect(uuidValidate(uuid)).toBe(true);
    });
  });

  // Test for validating a valid UUID
  test('GET /v3/v/{valid-uuid} should validate a valid UUID', async () => {
    // First get a valid UUID from the API
    const uuidResponse = await request(app).get('/v3');
    const uuid = uuidResponse.text;

    const response = await request(app).get(`/v3/v/${uuid}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`VALID`);
  });

  // Test for validating an invalid UUID
  test('GET /v3/v/{invalid-uuid} should return an error for invalid UUID', async () => {
    const invalidUuid = 'not-a-uuid';
    const response = await request(app).get(`/v3/v/${invalidUuid}`);

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe(`INVALID`);
  });

  // Test for custom namespace
  test('GET /v3?name=test&namespace=6ba7b811-9dad-11d1-80b4-00c04fd430c8 should use custom namespace', async () => {
    const customNamespace = '6ba7b811-9dad-11d1-80b4-00c04fd430c8'; // URL namespace
    const name = 'test';
    
    const response = await request(app).get(`/v3?name=${name}&namespace=${customNamespace}`);
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    
    // Calculate the expected UUID manually
    const expectedUuid = uuidv3(name, customNamespace);
    expect(response.text).toBe(expectedUuid);
  });

  // Test for invalid count parameter
  test('GET /v3/invalid should return an error for invalid count', async () => {
    const response = await request(app).get('/v3/invalid');

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

  // Test for count limits
  test('GET /v3/2000 should return an error for count > 1000', async () => {
    const response = await request(app).get('/v3/2000');
    
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
