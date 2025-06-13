# URL Shortener Backend

A robust and scalable URL shortener backend service built with Node.js, Express, and MongoDB.

## Features

- ✅ **URL Shortening**: Create short URLs with custom or auto-generated identifiers
- ✅ **URL Redirection**: Fast redirection to original URLs with click tracking
- ✅ **Analytics**: Track clicks and access patterns
- ✅ **Expiration**: Automatic URL expiration with configurable timeframes
- ✅ **Rate Limiting**: Protection against abuse with configurable limits
- ✅ **Security**: Helmet, CORS, compression, and input validation
- ✅ **Pagination**: Efficient pagination for large datasets
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Validation**: Joi-based input validation
- ✅ **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Validation**: Joi
- **Security**: Helmet, express-rate-limit
- **Testing**: Jest, Supertest

## Project Structure

```tree
backend/
├── config/
│   ├── database.js         # Database connection configuration
│   └── environment.js      # Environment variables configuration
├── constants/
│   └── index.js           # Application constants
├── controllers/
│   └── urlController.js   # URL route controllers
├── middleware/
│   ├── errorHandler.js    # Error handling middleware
│   ├── security.js        # Security middleware
│   └── validation.js      # Input validation middleware
├── models/
│   └── urlModel.js        # MongoDB URL schema
├── routes/
│   └── urlRoutes.js       # API routes
├── services/
│   └── urlService.js      # Business logic layer
├── tests/
│   └── api.test.js        # API tests
├── utils/
│   ├── response.js        # Response utilities
│   └── urlUtils.js        # URL utility functions
├── .env.example           # Environment variables example
├── index.js               # Application entry point
├── package.json           # Dependencies and scripts
└── vercel.json           # Vercel deployment configuration
```

## Installation

1. **Clone the repository**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_USER=your_username
   MONGODB_PASSWORD=your_password
   MONGODB_CLUSTER=your_cluster
   MONGODB_DATABASE=url-shortener-app
   ```

4. **Start the server**

   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### URL Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shorten` | Create a short URL |
| GET | `/api/urls` | Get all URLs (paginated) |
| GET | `/api/details/:shortUrl` | Get URL details |
| GET | `/api/analytics/:shortUrl` | Get URL analytics |
| DELETE | `/api/delete/:shortUrl` | Delete a URL |
| GET | `/api/:shortUrl` | Redirect to original URL |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API welcome message |
| GET | `/health` | Health check |

## API Usage Examples

### Create Short URL

```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com",
    "customShortUrl": "my-link"
  }'
```

### Get URLs with Pagination

```bash
curl "http://localhost:3000/api/urls?page=1&limit=10&sortBy=createdAt&sortOrder=desc"
```

### Get URL Analytics

```bash
curl "http://localhost:3000/api/analytics/abc123"
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment mode |
| `MONGODB_USER` | - | MongoDB username |
| `MONGODB_PASSWORD` | - | MongoDB password |
| `MONGODB_CLUSTER` | cluster0.re3ha3x | MongoDB cluster |
| `MONGODB_DATABASE` | url-shortener-app | Database name |
| `SHORT_URL_LENGTH` | 6 | Generated URL length |
| `DEFAULT_EXPIRATION_DAYS` | 7 | Default expiration days |
| `CORS_ORIGIN` | * | CORS origin |

### Rate Limiting

- **General**: 100 requests per 15 minutes
- **URL Shortening**: 10 requests per minute

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## Deployment

### Vercel

The application is configured for Vercel deployment with `vercel.json`.

```bash
vercel deploy
```

### Environment Variables for Production

Set the following in your deployment platform:

- `MONGODB_USER`
- `MONGODB_PASSWORD`
- `NODE_ENV=production`
- `CORS_ORIGIN=https://yourdomain.com`

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Joi validation
- **Error Handling**: Secure error responses
- **URL Validation**: Protocol and format checking

## Performance Optimizations

- **Database Indexing**: Optimized queries
- **Compression**: Gzip compression
- **Pagination**: Efficient data loading
- **Connection Pooling**: MongoDB connection management
- **Caching**: Browser caching headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run `npm test` and `npm run lint`
6. Submit a pull request

## License

ISC License
