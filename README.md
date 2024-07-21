# Secrets App

## Description

Secrets App is a web application that allows users to register, log in, and share secrets anonymously. It supports user authentication via local strategy, Google, and Facebook. The app is built using Node.js, Express, MongoDB, and EJS with a MongoDB Atlas database.

## Features

- User registration and login with email and password.
- OAuth 2.0 authentication with Google and Facebook.
- Session management with Express-Session and Passport.js.
- Secure storage of user data in MongoDB Atlas.
- Anonymous sharing of secrets.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Passport.js (with Passport-Local, Passport-Google-OAuth20, Passport-Facebook)
- Express-Session
- EJS
- Body-Parser
- dotenv

## Installation

### Prerequisites

- Node.js
- MongoDB Atlas account

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/secrets-app.git
    cd secrets-app
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following:

    ```plaintext
    SECRET_KEY=your_secret_key
    CONNECT_TO_MONGOATLAS=your_mongodb_atlas_connection_string
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    FACEBOOK_CLIENT_ID=your_facebook_client_id
    FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
    ```

4. **Run the application locally:**

    ```bash
    npm start
    ```

    The app will be running at `http://localhost:3000`.

## Usage

- **Register and log in** to create an account.
- **Authenticate via Google or Facebook** if you prefer using social login.
- **Submit a secret** anonymously on the secrets page.

## License

This project is licensed under the MIT License.
