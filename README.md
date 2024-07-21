# URL Shortener App

A URL Shortener application built using the MEAN stack (MongoDB, Express.js, Angular, and Node.js) and styled with Tailwind CSS.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Production](#production)
- [License](#license)

## Features

- Shorten URLs and store them in a MongoDB database
- Redirect shortened URLs to the original URLs
- Responsive and modern UI using Tailwind CSS
- Copy shortened URLs to the clipboard
- Expire shortened URLs after a specified duration
- Click statistics for shortened URLs
- URL Details page with click statistics, original URL, shortened URL, creation date, and expiration date

## Installation

### Backend

1. Clone the repository:

    ```bash
    git clone https://github.com/manthanank/url-shortener-app.git
    cd url-shortener-app/backend
    ```

2. Install the backend dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add the following:

    ```env
    PORT=3000
    ```

4. Start the backend server:

    ```bash
    node index.js
    ```

### Frontend

1. Install the frontend dependencies:

    ```bash
    npm install
    ```

2. Start the frontend development server:

    ```bash
    ng serve
    ```

The frontend server will run on `http://localhost:4200` and the backend server will run on `http://localhost:3000`.

## Usage

1. Open your browser and go to `http://localhost:4200`.
2. Enter a URL in the input field and click the "Shorten" button.
3. The shortened URL will be displayed. Click the shortened URL to be redirected to the original URL.
4. Use the "Copy Link" button to copy the shortened URL to your clipboard.

## Production

To build and deploy the application for production:

1. **Build the Frontend**

    ```bash
    ng build --prod
    ```

2. **Start the Backend**

    Ensure your `.env` file contains the production MongoDB URI.

    ```bash
    cd backend
    node index.js
    ```

3. **Deploy the Application**

    Deploy your application using your preferred cloud provider or hosting service. Ensure the `dist/url-shortener-app` directory is correctly served by your backend.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
