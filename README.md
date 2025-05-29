# Charging Station Management System

A full-stack application for managing EV charging stations built with Node.js, Express, PostgreSQL, and Vue.js.

## Features

- User authentication with JWT
- CRUD operations for charging stations
- Interactive map view with station markers
- Filtering stations by status, connector type, and power output
- Responsive design

## Project Structure

```

charging-station-app/
├── backend/             # Node.js & Express backend
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── .env.example     # Environment variables example
│   ├── package.json     # Backend dependencies
│   └── server.js        # Entry point
│
└── frontend/            # Vue.js frontend
    ├── public/          # Static files
    ├── src/             # Source files
    │   ├── assets/      # Assets
    │   ├── components/  # Vue components
    │   ├── services/    # API services
    │   ├── store/       # Vuex store
    │   ├── views/       # Vue views
    │   ├── App.vue      # Root component
    │   ├── main.js      # Entry point
    │   └── router.js    # Vue Router
    ├── .env.example     # Environment variables example
    └── package.json     # Frontend dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your database connection:
   ```
   DATABASE_URL=postgres://username:password@hostname:port/database
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   CORS_ORIGIN=http://localhost:8080
   ```

4. Set up the database and create an admin user:
   ```
   npm run setup-db
   ```

5. Start the server:
   ```
   npm start
   ```
   For development with auto-reload:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   VUE_APP_API_URL=http://localhost:5000/api/
   ```

4. Start the development server:
   ```
   npm run serve
   ```

5. Build for production:
   ```
   npm run build
   ```

## Deployment

### Backend Deployment

1. Set up a PostgreSQL database on your preferred cloud provider.
2. Deploy the backend to a platform like Heroku, Render, or AWS:
   - Set the required environment variables
   - Configure the production database connection

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login and get JWT token

### Charging Stations

- `GET /api/stations` - Get all charging stations (with optional filters)
- `GET /api/stations/:id` - Get a specific charging station
- `POST /api/stations` - Create a new charging station (requires authentication)
- `PUT /api/stations/:id` - Update a charging station (requires authentication)
- `DELETE /api/stations/:id` - Delete a charging station (requires authentication)
- `GET /api/stations/types/connectors` - Get all connector types
