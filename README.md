# User Authentication Backend

This project implements a user authentication module using **NestJS** and **MongoDB**, allowing users to sign up and sign in to the application securely. It uses JWT (JSON Web Tokens) for authentication and follows best practices for security.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Logging and Error Handling](#logging-and-error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Sign Up**: Allows users to register with email, name, and password.
- **User Sign In**: Authenticates users and issues JWT tokens.
- **Secure Password Handling**: Passwords are hashed before storage using bcrypt.
- **Token Expiration**: JWT tokens are valid for 1 hour.
- **Comprehensive Logging**: Records significant events and errors for easier debugging.
- **Input Validation**: Ensures strong passwords meet complexity requirements.

## Technologies Used

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Requirements

- Node.js (version 14 or higher)
- MongoDB (running locally or in the cloud)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AhmadSamDevelopment/auth-backend.git
   cd auth-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```env
   MONGODB_URI=mongodb://localhost/nest_auth_db
   JWT_SECRET=your_secret_key
   ```

## Environment Variables

| Variable       | Description                                   |
|----------------|-----------------------------------------------|
| `MONGODB_URI`  | MongoDB connection string.                    |
| `JWT_SECRET`   | Secret key used for signing JWT tokens.      |

## API Endpoints

### Sign Up

- **Endpoint**: `POST /auth/signup`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "Password123!"
  }
  ```
- **Response**:
  - **201 Created**: User registered successfully.
  - **409 Conflict**: User with this email already exists.

### Sign In

- **Endpoint**: `POST /auth/signin`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Response**:
  - **200 OK**: Access token issued.
  - **401 Unauthorized**: Invalid credentials.

## Running the Application

To start the application, run:

```bash
npm run start
```

The server will start on `http://localhost:3000`.

## Testing

Run the test suite with:

```bash
npm run test
```

The tests include validation checks and ensure the authentication flow is functioning correctly.

## Logging and Error Handling

The application uses NestJS's built-in logging to capture significant events and errors. Errors are handled gracefully and appropriate HTTP status codes are returned.

## Contributing

While this is a personal assignment, contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```