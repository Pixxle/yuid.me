// Cloudflare Worker entry point for yuid.me
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

// Simplified handlers for the worker environment
const handlers = {
  // Generate a single UUID v4
  generateSingleV4: () => {
    const uuid = uuidv4();
    return new Response(uuid, {
      headers: { 'Content-Type': 'text/plain' }
    });
  },

  // Generate a single UUID v3 (simplified version for worker)
  generateSingleV3: () => {
    // Since we're not importing the full v3 module here, this is a simplified placeholder
    // In a real implementation, you'd import and use the v3 function properly
    const { v3: uuidv3 } = require('uuid');
    const uuid = uuidv3('yuid.me', uuidv3.DNS);
    return new Response(uuid, {
      headers: { 'Content-Type': 'text/plain' }
    });
  },

  // Generate multiple UUID v4s
  generateMultipleV4: (count) => {
    // Validate the count parameter
    count = parseInt(count);
    if (isNaN(count) || count < 1 || count > 1000) {
      return new Response('Count must be a number between 1 and 1000', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Generate the specified number of UUIDs
    const uuids = Array.from({ length: count }, () => uuidv4());
    return new Response(uuids.join('\n'), {
      headers: { 'Content-Type': 'text/plain' }
    });
  },

  // Generate multiple UUID v3s (simplified for worker)
  generateMultipleV3: (count) => {
    // Validate the count parameter
    count = parseInt(count);
    if (isNaN(count) || count < 1 || count > 1000) {
      return new Response('Count must be a number between 1 and 1000', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Since we're not importing the full v3 module here, this is a simplified placeholder
    const { v3: uuidv3 } = require('uuid');
    const namespace = uuidv3.DNS;
    const uuids = Array.from({ length: count }, (_, i) => 
      uuidv3(`yuid.me-${i}`, namespace)
    );
    
    return new Response(uuids.join('\n'), {
      headers: { 'Content-Type': 'text/plain' }
    });
  },

  // Validate UUID (works for any version)
  validateUuid: (uuid) => {
    const isValid = uuidValidate(uuid);
    
    if (isValid) {
      return new Response('VALID', {
        headers: { 'Content-Type': 'text/plain' }
      });
    } else {
      return new Response('INVALID', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};

// Request handler for Cloudflare Worker
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Simple routing based on path
    if (path === '/') {
      return handlers.generateSingleV4();
    }
    
    if (path === '/v3') {
      return handlers.generateSingleV3();
    }
    
    if (path === '/v4') {
      return handlers.generateSingleV4();
    }
    
    // Validation routes
    if (path.startsWith('/v/')) {
      const uuid = path.substring(3);
      return handlers.validateUuid(uuid);
    }
    
    if (path.startsWith('/v3/v/')) {
      const uuid = path.substring(5);
      return handlers.validateUuid(uuid);
    }
    
    if (path.startsWith('/v4/v/')) {
      const uuid = path.substring(5);
      return handlers.validateUuid(uuid);
    }
    
    // Multiple UUIDs routes
    const countMatch = path.match(/^\/(\d+)$/);
    if (countMatch) {
      const count = countMatch[1];
      return handlers.generateMultipleV4(count);
    }
    
    const countMatchV3 = path.match(/^\/v3\/(\d+)$/);
    if (countMatchV3) {
      const count = countMatchV3[1];
      return handlers.generateMultipleV3(count);
    }
    
    const countMatchV4 = path.match(/^\/v4\/(\d+)$/);
    if (countMatchV4) {
      const count = countMatchV4[1];
      return handlers.generateMultipleV4(count);
    }
    
    // Default 404 response
    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
