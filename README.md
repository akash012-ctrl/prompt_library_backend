# Prompt Library Backend

This repository contains the backend API server for the Prompt Library application, a platform for storing, sharing, and managing AI prompts. The API provides endpoints for user authentication, prompt management, user management, and reporting.

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Technologies Used](#technologies-used)
4. [Setup Instructions](#setup-instructions)
5. [API Documentation](#api-documentation)
6. [Database Models](#database-models)
7. [Authentication](#authentication)
8. [Middleware](#middleware)
9. [Controllers](#controllers)
10. [Routes](#routes)
11. [Utilities](#utilities)

## Overview

The Prompt Library is a backend service that allows users to:
- Register and login to the platform
- Create, read, update, and delete prompts
- Report inappropriate prompts
- Bookmark favorite prompts
- Search and filter prompts by tags, categories, and text
- Manage user accounts (admin only)

The API follows RESTful principles and uses JSON Web Tokens (JWT) for authentication.

## Project Structure

```
prompt-library-backend/
├── controllers/           # Business logic for routes
├── middleware/            # Custom middleware functions
├── models/                # Database models (Mongoose schemas)
├── routes/                # API route definitions
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── .env                   # Environment variables
├── package.json           # Project dependencies
├── seed.js                # Database seeding script
└── testModels.js          # Database model testing script
```

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Library for hashing passwords
- **express-validator**: Middleware for input validation
- **nodemailer**: Module for sending emails
- **dotenv**: Module to load environment variables
- **Jest**: Testing framework

## Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd prompt-library-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create or update the `.env` file with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

4. **Seed the database (optional)**
```bash
node seed.js
```

5. **Run the server**
```bash
# Development mode
npm run dev

# Production mode
npm run prod
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and get JWT token
- `POST /api/auth/update-password`: Update user password
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/auth/reset-password/:token`: Reset password with token

### Prompt Endpoints
- `GET /api/prompts`: Get all prompts
- `GET /api/prompts/:id`: Get a specific prompt by ID
- `GET /api/prompts/category/:category`: Get prompts by category
- `GET /api/prompts/search`: Search prompts by title or tags
- `POST /api/prompts`: Create a new prompt (authenticated)
- `PUT /api/prompts/:id`: Update a prompt (owner only)
- `DELETE /api/prompts/:id`: Delete a prompt (owner only)

### User Endpoints (Admin only)
- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get a specific user
- `PUT /api/users/:id`: Update a user
- `DELETE /api/users/:id`: Delete a user

### Report Endpoints
- `GET /api/reports`: Get all reports (admin only)
- `POST /api/reports`: Create a new report (authenticated)
- `DELETE /api/reports/:id`: Delete a report (admin only)

## Database Models

### User Model
```javascript
{
  email: String,         // required, unique, lowercase, trimmed
  password: String,      // required, hashed
  role: String,          // enum: ['user', 'viewer', 'admin'], default: 'user'
  bookmarks: [ObjectId], // references to Prompt documents
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date        // default: Date.now
}
```

### Prompt Model
```javascript
{
  userId: ObjectId,      // reference to User document, required
  title: String,         // required, indexed
  description: String,   // required
  tags: [String],        // indexed
  category: String,      // enum: ['design', 'animation', 'coding', 'writing', 'other']
  likes: Number,         // default: 0
  dislikes: Number,      // default: 0
  votes: Number,         // default: 0
  isReported: Boolean,   // default: false
  createdAt: Date,       // default: Date.now
  updatedAt: Date        // default: Date.now
}
```

### Report Model
```javascript
{
  promptId: ObjectId,    // reference to Prompt document, required
  reportedBy: ObjectId,  // reference to User document, required
  reason: String,        // required
  createdAt: Date        // default: Date.now
}
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. The token is generated upon login and must be included in the `Authorization` header of requests to protected endpoints:

```
Authorization: Bearer <your_token>
```

The token contains the user ID and has an expiration time of 1 hour. Password reset tokens are generated separately with their own expiration time.

## Middleware

### Authentication Middleware (`middleware/auth.js`)
Validates JWT tokens and extracts user ID for protected routes.

### Admin Middleware (`middleware/admin.js`)
Ensures the user has admin privileges for admin-only routes.

### Ownership Middleware (`middleware/ownership.js`)
Verifies that the authenticated user owns the resource they're trying to modify.

## Controllers

### Prompt Controller (`controllers/promptController.js`)
Contains logic for creating, reading, updating, and deleting prompts, as well as filtering prompts by category.

### Report Controller (`controllers/reportController.js`)
Handles creating and managing reports of inappropriate prompts.

### User Controller (`controllers/userController.js`)
Manages user accounts, including reading, updating, and deleting user information.

## Routes

### Authentication Routes (`routes/auth.js`)
Handles user registration, login, and password management.

### Prompt Routes (`routes/promptRoutes.js`)
Manages CRUD operations for prompts and prompt searches.

### User Routes (`routes/userRoutes.js`)
Admin-only endpoints for user management.

### Report Routes (`routes/reportRoutes.js`)
Endpoints for reporting and managing inappropriate content.

## Utilities

### Database Seeding (`seed.js`)
Populates the database with sample users, prompts, and reports for testing.

### Model Testing (`testModels.js`)
Tests the creation of database models to ensure they're working correctly.

---

**Note**: This API is designed to be used with a frontend application that consumes these endpoints. For local development, you can use tools like Postman to test the API endpoints.
