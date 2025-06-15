# URL Shortener App

A modern, full-featured URL shortener application built with Angular 20, Node.js, Express.js, MongoDB Atlas, and styled with Tailwind CSS 4. Features a robust backend API, comprehensive analytics, contact management, admin dashboard, and modern UI components with legal compliance pages.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Production](#production)
- [System Architecture](#system-architecture)
- [Contributing](#contributing)
- [Support](#support)
- [Changelog](#changelog)
- [License](#license)

## Features

### Core Features

- ✅ **URL Shortening**: Create short, memorable URLs from long original URLs
- ✅ **Smart Redirects**: Fast redirection to original URLs with click tracking
- ✅ **Analytics Dashboard**: Comprehensive statistics and click analytics
- ✅ **Bulk Operations**: Support for bulk URL management
- ✅ **Custom Expiration**: Set custom expiration dates for URLs
- ✅ **Contact Management**: Contact form with admin dashboard for inquiries
- ✅ **Legal Compliance**: Privacy policy, terms of service, and cookie policy pages

### User Experience

- ✅ **Modern UI**: Responsive design with Tailwind CSS 4
- ✅ **Dark/Light Mode**: Theme switching with system preference detection
- ✅ **Copy to Clipboard**: One-click copying of shortened URLs
- ✅ **Real-time Updates**: Live analytics and status updates
- ✅ **Mobile Responsive**: Optimized for all device sizes
- ✅ **Lazy Loading**: Route-based code splitting for optimal performance

### Security & Performance

- ✅ **Rate Limiting**: API protection with configurable limits
- ✅ **Input Validation**: Comprehensive URL and data validation
- ✅ **Security Headers**: Helmet.js security middleware
- ✅ **CORS Protection**: Proper cross-origin resource sharing
- ✅ **Compression**: Response compression for better performance

### Administrative Features

- ✅ **URL Management**: View, edit, and delete shortened URLs
- ✅ **Analytics Insights**: Detailed click statistics and trends
- ✅ **Bulk Export**: Export URL data and analytics
- ✅ **Health Monitoring**: API health checks and status monitoring
- ✅ **Contact Administration**: Manage and respond to user inquiries
- ✅ **Content Management**: Legal pages and policy management

## Technology Stack

### Frontend

- **Angular**: 20.0.3 (Latest stable with standalone components)
- **TailwindCSS**: 4.1.10 (Utility-first CSS framework)
- **TypeScript**: 5.8.3
- **RxJS**: 7.8.2 (Reactive programming)
- **Angular CLI**: 20.0.2 (Build system)

### Backend

- **Node.js**: >=18.0.0
- **Express.js**: 4.19.2
- **MongoDB**: Atlas (Cloud database)
- **Mongoose**: 8.5.1 (ODM)
- **Swagger**: API documentation with UI
- **Jest**: 29.7.0 (Testing framework)

### Development & Deployment

- **Angular CLI**: 20.0.2
- **Jest**: 29.7.0 (Testing framework)
- **Vercel**: Serverless deployment platform
- **Swagger**: API documentation
- **ESLint**: Code linting and formatting
- **Nodemon**: Development server with hot reload

## Installation

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **MongoDB Atlas**: Cloud database account (or local MongoDB installation)
- **npm**: Package manager (comes with Node.js)

### Backend Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/manthanank/url-shortener-app.git
    cd url-shortener-app
    ```

2. **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3. **Configure environment variables:**

    Create a `.env` file in the `backend` directory:

    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_atlas_connection_string
    NODE_ENV=development
    CORS_ORIGIN=http://localhost:4200
    ```

4. **Start the backend server:**

    ```bash
    # Development mode with auto-restart
    npm run dev

    # Production mode
    npm start
    ```

### Frontend Setup

1. **Install frontend dependencies:**

    ```bash
    # From the root directory
    npm install
    ```

2. **Configure environment:**

    Update `src/environments/environment.development.ts`:

    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:3000/api'
    };
    ```

3. **Start the development server:**

    ```bash
    npm start
    # or
    ng serve
    ```

The application will be available at:

- **Frontend**: `http://localhost:4200`
- **Backend API**: `http://localhost:3000`
- **API Documentation**: `http://localhost:3000/api-docs`

## Usage

### Basic URL Shortening

1. **Access the application** at `http://localhost:4200`
2. **Enter a long URL** in the input field
3. **Click "Shorten URL"** to generate a short URL
4. **Copy the shortened URL** using the copy button
5. **Test the redirect** by clicking the shortened URL

### Analytics & Management

1. **View Analytics**: Navigate to `/analytics` to see URL statistics
2. **Manage URLs**: View all shortened URLs with click counts
3. **Bulk Operations**: Select multiple URLs for batch operations
4. **Export Data**: Download analytics reports

### Advanced Features

- **Custom Expiration**: Set expiration dates for temporary URLs
- **Theme Toggle**: Switch between light and dark modes
- **Responsive Design**: Use on mobile, tablet, or desktop devices
- **Contact Form**: User inquiry submission and management
- **Legal Pages**: Privacy policy, terms of service, and cookie policy
- **Admin Dashboard**: Administrative interface for contact management

### Additional Pages

- **Contact**: `/contact` - Submit inquiries and feedback
- **Privacy Policy**: `/privacy` - Data privacy and protection information
- **Terms of Service**: `/terms` - Terms and conditions of use
- **Cookie Policy**: `/cookies` - Cookie usage and preferences
- **Admin Contacts**: `/admin/contacts` - Administrative contact management

## API Documentation

The backend provides a comprehensive REST API with the following endpoints:

### Core Endpoints

- `POST /api/shorten` - Create a new short URL
- `GET /api/urls` - Retrieve all URLs with pagination
- `GET /api/urls/:shortUrl` - Get URL details and analytics
- `DELETE /api/urls/:shortUrl` - Delete a short URL
- `GET /api/analytics` - Get comprehensive analytics
- `POST /api/contact` - Submit contact form
- `GET /api/admin/contacts` - Get all contact submissions (Admin)

### API Features

- **Rate Limiting**: Protection against abuse
- **Validation**: Input validation with Joi
- **Error Handling**: Standardized error responses
- **Swagger Documentation**: Interactive API docs at `/api-docs`

For detailed API documentation, visit the [Backend API Documentation](backend/API_DOCS.md).

## Production

### Building for Production

1. **Build the frontend:**

    ```bash
    npm run build
    ```

2. **Configure production environment:**

    Update `src/environments/environment.ts`:

    ```typescript
    export const environment = {
      production: true,
      apiUrl: 'https://your-api-domain.vercel.app/api'
    };
    ```

### Deployment Options

#### Vercel (Recommended)

1. **Deploy backend:**

    ```bash
    cd backend
    vercel
    ```

2. **Deploy frontend:**

    ```bash
    vercel
    ```

#### Manual Deployment

1. **Backend**: Deploy to any Node.js hosting service (Heroku, DigitalOcean, AWS)
2. **Frontend**: Serve the `dist/` folder from any static hosting service
3. **Database**: Ensure MongoDB Atlas connection string is configured

### Environment Configuration

**Production Backend `.env`:**

```env
PORT=3000
MONGODB_URI=your_production_mongodb_uri
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

## System Architecture

This application follows a modern JAMstack architecture with serverless deployment. For detailed system design documentation, see [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md).

### Key Architecture Components

- **Frontend**: Angular 20 SPA with Tailwind CSS
- **Backend**: Node.js/Express.js RESTful API
- **Database**: MongoDB Atlas (Cloud NoSQL)
- **Deployment**: Vercel serverless functions
- **CDN**: Static asset delivery optimization

**Live Demo**: [URL Shortener App](https://url-shortener-app-manthanank.vercel.app/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support and questions:

- 📧 **Email**: [Support](mailto:support@example.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/manthanank/url-shortener-app/issues)
- 📖 **Documentation**: [System Design](SYSTEM_DESIGN.md) | [API Docs](backend/API_DOCS.md)

## Changelog

### Version 2.0.0 (Current)

- ✅ Upgraded to Angular 20.0.3
- ✅ Updated to Tailwind CSS 4.1.10
- ✅ Enhanced analytics dashboard
- ✅ Improved security with rate limiting
- ✅ Added bulk operations
- ✅ Serverless deployment optimization
- ✅ Comprehensive API documentation
- ✅ Added system architecture documentation
- ✅ Contact form with admin management system
- ✅ Legal compliance pages (Privacy, Terms, Cookies)
- ✅ Standalone Angular components with lazy loading
- ✅ Enhanced testing with Jest integration
- ✅ ESLint configuration for code quality

---

Built with ❤️ using Angular, Node.js, and MongoDB
