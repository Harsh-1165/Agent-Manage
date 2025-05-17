
# Auth App Backend

This is the backend for the MERN Authentication App.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Setup Instructions

1. Ensure MongoDB is installed and running on your machine
2. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/auth-app
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   ```
3. Install dependencies
   ```
   npm install
   ```
4. Run the server
   ```
   npm run dev
   ```

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register a new user
  - Body: `{ email, password }`
  - Response: `{ message: "User registered successfully" }`

- `POST /api/auth/login` - Login a user
  - Body: `{ email, password }`
  - Response: `{ token: "JWT_TOKEN" }`

- `GET /api/auth/verify` - Verify JWT token and get user info
  - Headers: `Authorization: Bearer JWT_TOKEN`
  - Response: `{ id, email }`

## Error Handling

All routes include proper validation and error handling. Error responses follow the format:
```json
{
  "message": "Error message description"
}
```

## Security Features

- Password hashing with bcrypt
- JWT authentication for protected routes
- Input validation with express-validator
- CORS configuration
