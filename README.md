# CRUD API

This project implements a CRUD API for managing users.

## Prerequisites

- Node.js (v22.14.0 or higher recommended)
- npm (comes with Node.js)

## Installation

To install the necessary dependencies, run:

```bash
npm install


Configuration
The default server port is 4000.

API Endpoint example: http://localhost:4000/api/users/1

If needed, you can adjust the port by modifying the configuration file or the environment variables.

Available Scripts
Start in Development Mode
To start the API in development mode with live reload, run:

bash
npm run start:dev
Start in Production Mode
To start the API in production mode, run:

bash
npm run start:prod
Run Tests
To execute the test suite and ensure everything works as expected, run:

bash
npm run test
API Documentation
Endpoints
Users
GET /api/users: Retrieve a list of all users.

GET /api/users/:id: Retrieve a user by ID.

POST /api/users: Create a new user.

PUT /api/users/:id: Update an existing user by ID.

DELETE /api/users/:id: Delete a user by ID.

Error Handling
The API uses standard HTTP status codes to indicate success or errors:

200 OK for successful operations.

201 Created for successful creation of resources.

400 Bad Request for client-side errors.

404 Not Found when a resource is not found.

500 Internal Server Error for unexpected issues.


