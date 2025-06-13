# URL Shortener API Documentation

## Base URL

```text
Development: http://localhost:3000
Production: https://your-domain.vercel.app
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible with rate limiting.

## Rate Limiting

- **General**: 100 requests per 15 minutes
- **URL Shortening**: 10 requests per minute
- **Admin**: 100 requests per 15 minutes

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2025-06-13T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "timestamp": "2025-06-13T10:30:00.000Z",
  "errors": ["Detailed error messages"]
}
```

## Endpoints

### 1. Create Short URL

Create a new short URL from an original URL.

**Endpoint:** `POST /api/shorten`

**Request Body:**

```json
{
  "originalUrl": "https://example.com/very/long/url",
  "customShortUrl": "my-link" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "Short URL created successfully",
  "data": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "originalUrl": "https://example.com/very/long/url",
    "shortUrl": "abc123",
    "clicks": 0,
    "isActive": true,
    "expirationDate": "2025-06-20T10:30:00.000Z",
    "createdAt": "2025-06-13T10:30:00.000Z",
    "updatedAt": "2025-06-13T10:30:00.000Z"
  },
  "timestamp": "2025-06-13T10:30:00.000Z"
}
```

**Status Codes:**

- `201` - URL created successfully
- `200` - URL already exists
- `400` - Invalid request data
- `409` - Custom short URL already exists

---

### 2. Get All URLs

Retrieve all URLs with pagination and filtering.

**Endpoint:** `GET /api/urls`

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 50)
- `sortBy` (string): Sort field (default: "createdAt")
- `sortOrder` (string): "asc" or "desc" (default: "desc")
- `includeExpired` (boolean): Include expired URLs (default: false)
- `search` (string): Search in URLs

**Example:** `GET /api/urls?page=1&limit=10&sortBy=clicks&sortOrder=desc`

**Response:**

```json
{
  "success": true,
  "message": "URL retrieved successfully",
  "data": {
    "urls": [
      {
        "id": "64a7b8c9d1e2f3a4b5c6d7e8",
        "originalUrl": "https://example.com",
        "shortUrl": "abc123",
        "clicks": 15,
        "isActive": true,
        "expirationDate": "2025-06-20T10:30:00.000Z",
        "createdAt": "2025-06-13T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 42,
      "hasNextPage": true,
      "hasPrevPage": false,
      "limit": 10
    }
  }
}
```

---

### 3. Get URL Details

Get detailed information about a specific short URL.

**Endpoint:** `GET /api/details/:shortUrl`

**Response:**

```json
{
  "success": true,
  "message": "URL retrieved successfully",
  "data": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "originalUrl": "https://example.com",
    "shortUrl": "abc123",
    "clicks": 15,
    "isActive": true,
    "isExpired": false,
    "daysUntilExpiration": 7,
    "expirationDate": "2025-06-20T10:30:00.000Z",
    "createdAt": "2025-06-13T10:30:00.000Z",
    "lastAccessedAt": "2025-06-13T12:00:00.000Z"
  }
}
```

---

### 4. Get URL Analytics

Get analytics and statistics for a specific short URL.

**Endpoint:** `GET /api/analytics/:shortUrl`

**Response:**

```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "data": {
    "shortUrl": "abc123",
    "originalUrl": "https://example.com",
    "totalClicks": 15,
    "createdAt": "2025-06-13T10:30:00.000Z",
    "lastAccessedAt": "2025-06-13T12:00:00.000Z",
    "isActive": true,
    "isExpired": false,
    "expirationDate": "2025-06-20T10:30:00.000Z",
    "daysUntilExpiration": 7
  }
}
```

---

### 5. Redirect to Original URL

Redirect to the original URL and increment click counter.

**Endpoint:** `GET /api/:shortUrl`

**Response:** HTTP 302 redirect to original URL

**Status Codes:**

- `302` - Successful redirect
- `404` - URL not found or expired

---

### 6. Delete URL

Delete a short URL.

**Endpoint:** `DELETE /api/delete/:shortUrl`

**Response:**

```json
{
  "success": true,
  "message": "URL deleted successfully",
  "data": {
    "shortUrl": "abc123"
  }
}
```

---

## Admin Endpoints

### 7. System Statistics

Get system-wide statistics.

**Endpoint:** `GET /admin/stats`

**Response:**

```json
{
  "success": true,
  "message": "System statistics retrieved successfully",
  "data": {
    "totalUrls": 1250,
    "activeUrls": 1100,
    "expiredUrls": 150,
    "totalClicks": 45600,
    "urlsCreatedToday": 25
  }
}
```

---

### 8. Manual Cleanup

Manually trigger cleanup of expired URLs.

**Endpoint:** `POST /admin/cleanup`

**Response:**

```json
{
  "success": true,
  "message": "Cleanup completed successfully",
  "data": {
    "cleanedCount": 15
  }
}
```

---

### 9. System Health

Get detailed system health information.

**Endpoint:** `GET /admin/health`

**Response:**

```json
{
  "success": true,
  "message": "System health check",
  "data": {
    "status": "healthy",
    "timestamp": "2025-06-13T10:30:00.000Z",
    "uptime": 86400,
    "memory": {
      "rss": 45678592,
      "heapTotal": 25165824,
      "heapUsed": 18023456,
      "external": 1234567
    },
    "stats": {
      "totalUrls": 1250,
      "activeUrls": 1100,
      "expiredUrls": 150,
      "totalClicks": 45600,
      "urlsCreatedToday": 25
    }
  }
}
```

---

## System Endpoints

### 10. API Welcome

Get API welcome message.

**Endpoint:** `GET /`

**Response:**

```json
{
  "success": true,
  "message": "Welcome to URL Shortener API",
  "version": "2.0.0",
  "documentation": "/api-docs"
}
```

---

### 11. Health Check

Basic health check endpoint.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "success": true,
  "message": "URL Shortener API is running",
  "timestamp": "2025-06-13T10:30:00.000Z",
  "environment": "development"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Examples

### Using cURL

**Create Short URL:**

```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com/very/long/url",
    "customShortUrl": "my-link"
  }'
```

**Get URLs with Pagination:**

```bash
curl "http://localhost:3000/api/urls?page=1&limit=5&sortBy=clicks&sortOrder=desc"
```

**Get URL Analytics:**

```bash
curl "http://localhost:3000/api/analytics/abc123"
```

**Delete URL:**

```bash
curl -X DELETE "http://localhost:3000/api/delete/abc123"
```

### Using JavaScript (Fetch)

```javascript
// Create short URL
const response = await fetch('/api/shorten', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    originalUrl: 'https://example.com/very/long/url'
  })
});

const data = await response.json();
console.log(data);
```

## Validation Rules

### Original URL

- Required
- Must be a valid URL with http:// or https:// protocol
- Minimum length: 3 characters
- Maximum length: 2048 characters

### Custom Short URL

- Optional
- Alphanumeric characters only
- Minimum length: 3 characters
- Maximum length: 20 characters
- Must be unique

## Rate Limiting Details

The API implements rate limiting to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes per IP
- **URL shortening**: 10 requests per minute per IP
- **Admin endpoints**: 100 requests per 15 minutes per IP

When rate limit is exceeded, the API returns:

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## Security Features

- **Helmet**: Security headers protection
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Joi-based validation for all inputs
- **Rate Limiting**: Protection against abuse
- **URL Sanitization**: Automatic protocol addition
- **Error Handling**: Secure error responses without sensitive data exposure
