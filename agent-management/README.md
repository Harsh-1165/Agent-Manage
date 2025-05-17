
# MERN Authentication Application

A full-stack MERN application featuring user authentication with JWT, protected routes, and a responsive UI.

## Project Structure

This project is organized into two main folders:

### Frontend

Built with React, TypeScript, and shadcn/ui components for a clean, modern UI.

- User registration and login forms with validation
- Protected dashboard route
- JWT-based authentication
- Modern, responsive UI with animations
- Error handling and user feedback

### Backend

Built with Node.js, Express, and MongoDB for secure authentication.

- User registration and login API
- JWT token generation and verification
- Password encryption with bcrypt
- MongoDB database integration

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend folder with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/auth-app
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the project root folder (if in backend folder, use `cd ..`)

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Open your browser to the URL shown in the terminal (typically http://localhost:8080)

## Features

- User registration with email validation
- Secure login with JWT authentication
- Protected dashboard for authenticated users
- Responsive design for all device sizes
- Form validation and error handling
- Password visibility toggle
- Clean, modern UI with subtle animations

## Technical Implementation

- Frontend: React, TypeScript, shadcn/ui components, react-router, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT, bcrypt for password hashing
- Validation: express-validator for backend, custom validation for frontend
- Error Handling: Comprehensive error handling on both frontend and backend

## License

This project is provided as a demonstration of MERN stack development and authentication implementation.
