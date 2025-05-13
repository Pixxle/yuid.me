# yuid.me - Simple UUID Generation Service

A minimal and efficient UUID generation service that provides plain text UUIDs via HTTP requests.

## Features

- Generate a single random UUID (v4)
- Generate multiple UUIDs in one request (up to 1000)
- Validate existing UUIDs
- Plain text responses for easy integration
- Comprehensive request logging

## API Endpoints

### Generate a Single UUID

```
GET /
```

**Example:**

```bash
curl https://yuid.me/
```

**Response:**

```
f47ac10b-58cc-4372-a567-0e02b2c3d479
```

### Generate Multiple UUIDs

```
GET /<count>
```

Where `<count>` is a number between 1 and 1000.

**Example:**

```bash
curl https://yuid.me/5
```

**Response:**

```
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
716c7752-8c8f-4ab8-b438-e70000000000
91461989-13cb-4bf7-b798-40bef3f5c8d8
b4b6a9c8-7a69-4c47-9fb3-8b5f58ead537
```

### Validate a UUID

```
GET /v/<uuid>
```

**Example:**

```bash
curl https://yuid.me/f47ac10b-58cc-4372-a567-0e02b2c3d479
```

**Response for valid UUID:**

```
Valid UUID: f47ac10b-58cc-4372-a567-0e02b2c3d479
```

**Response for invalid UUID:**

```
Invalid UUID: not-a-uuid
```

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/yuid.me.git
   cd yuid.me
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The server will start on http://localhost:3000

### Running Tests

```bash
npm test
```

## Deployment

This application is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments.

## Logging

The application includes comprehensive request logging:

- **HTTP Request Logging**: Uses Morgan to log all incoming HTTP requests with detailed information including:

  - IP address
  - HTTP method
  - URL
  - Status code
  - Response time
  - Request type (single UUID, multiple UUIDs, validation)

- **Detailed Application Logging**: Every request is logged with timestamps, showing:
  - When requests are received
  - Request details (method, URL, source IP)
  - Response details (status code, response time)
  - Operation-specific information (UUIDs generated, validation results)

These logs are output to the console and can be captured by any log aggregation service when deployed to production.

## Maintenance

### Automated Dependency Updates

This project uses Dependabot to automatically keep dependencies up-to-date and secure. Dependabot creates pull requests to update dependencies according to the configuration in `.github/dependabot.yml`.

Dependabot is configured to:

- Check for npm dependency updates daily
- Create pull requests with appropriate labels
- Auto-merge minor and patch updates after CI passes

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
