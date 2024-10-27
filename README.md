
# Notes API with User Authentication

This project is a RESTful API for managing user notes. It allows users to register, log in, and manage their notes with added features like email notifications, note prioritization, and integration with generative AI for structuring note content.

## Features

- **User Registration & Authentication**: Secure registration and login with password hashing and JWT-based authentication.
- **CRUD Operations for Notes**: Users can create, read, update, and delete notes.
- **AI-Powered Note Structuring**: Generates structured notes from a user's message using Google Generative AI API.
- **Email Notification**: Automatically sends email notifications for notes containing email addresses.
- **Protected Routes**: Only authenticated users can manage their notes.

## Technologies

- **Node.js**: JavaScript runtime environment
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing user and note data
- **Mongoose**: ODM for MongoDB
- **JWT**: JSON Web Tokens for secure user authentication
- **bcrypt**: Hashing passwords securely
- **nodemailer**: Email sending functionality
- **Google Generative AI API**: Used for generating structured notes from user input

## Prerequisites

- [Node.js](https://nodejs.org/) and npm installed
- MongoDB instance running locally or on a cloud provider
- Google Cloud account with Generative AI API access
- Gmail account for sending emails (or another email provider)

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/notes-api.git
   cd notes-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:

   Create a `.env` file in the project root and add the following environment variables:
   ```bash
   PORT=5000
   mongo=<YOUR_MONGO_URI>
   JWT_SECRET=your_jwt_secret
   GOOGLE_API_KEY=your_google_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Run the Server**:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:5000`.

## API Endpoints

### Authentication

- **POST** `/api/users/register`: Register a new user.
  - **Body**: `{ "username": "string", "password": "string" }`

- **POST** `/api/users/login`: Log in an existing user.
  - **Body**: `{ "username": "string", "password": "string" }`

### Notes

- **GET** `/api/notes`: Retrieve all notes for the authenticated user.
- **POST** `/api/notes`: Create a new note.
  - **Body**: `{ "content": "string" }`
  - **Functionality**: If the content contains an email address, an email notification is sent.
  - **AI-Powered Structuring**: If no email is found, the content is processed with Google Generative AI to generate structured notes.

- **DELETE** `/api/notes/:id`: Delete a specific note by ID.

### Example API Workflow

1. **Register** and **Login** a user.
2. Use the returned token for authentication in the `Authorization` header (`x-auth-token`) for protected routes.
3. Create and manage notes using the `/api/notes` endpoints.

## Dependencies

- `bcryptjs`: For hashing passwords.
- `cors`: For enabling CORS.
- `express`: Server framework.
- `jsonwebtoken`: For token-based authentication.
- `mongoose`: MongoDB ORM.
- `nodemailer`: For email notifications.

## Security Considerations

- Ensure `JWT_SECRET`, `mongo` URI, and `GOOGLE_API_KEY` are not exposed in the code.
- Store email credentials securely, ideally using environment variables.
