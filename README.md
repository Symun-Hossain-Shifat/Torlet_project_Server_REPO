# Torlet Server

Backend server for the **Torlet** project, built with Node.js, Express.js, TypeScript, MongoDB, and Better Auth.

## 🚀 Features

* RESTful API with Express.js
* TypeScript support
* MongoDB database integration
* Better Auth authentication
* Secure session management
* CORS configuration
* Environment variable support
* API error handling
* Authentication-protected routes
* User and product/data management

## 🛠️ Technologies Used

* **Node.js**
* **Express.js**
* **TypeScript**
* **MongoDB**
* **Better Auth**
* **MongoDB Adapter**
* **dotenv**
* **CORS**

## 📁 Project Structure

```text
torlet-project-server/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── lib/
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

> The exact folder structure may vary depending on the current implementation.

## ⚙️ Installation

Clone the repository:

```bash
git clone <YOUR_SERVER_REPOSITORY_URL>
```

Go to the project directory:

```bash
cd torlet-project-server
```

Install dependencies:

```bash
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=TorletDatabase

CLIENT_URL=http://localhost:3000
```

Add any additional authentication-related environment variables required by your Better Auth configuration.

**Never commit your `.env` file to GitHub.**

## ▶️ Run the Project

### Development

```bash
npm run dev
```

The server should start on:

```text
http://localhost:5000
```

### Production Build

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## 🔑 Authentication

Torlet uses **Better Auth** for authentication.

Authentication is responsible for:

* User registration
* User login
* User logout
* Session management
* Protected routes
* User authentication state

The frontend communicates with the server using the configured authentication endpoints.

## 🗄️ Database

The project uses **MongoDB** as the primary database.

Database name:

```text
TorletDatabase
```

Make sure your MongoDB connection string is correctly configured in the `.env` file.

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

## 🌐 API

The server exposes API endpoints for the Torlet application.

Example API structure:

```text
/api/auth/*
/api/users/*
/api/products/*
```

> Update the endpoint list above according to the actual routes implemented in the project.

## 🔒 CORS

The server allows requests from the configured frontend URL.

Example:

```env
CLIENT_URL=http://localhost:3000
```

For production:

```env
CLIENT_URL=https://your-production-client.vercel.app
```

## 📦 Available Scripts

```bash
npm run dev
```

Runs the development server.

```bash
npm run build
```

Builds the TypeScript project.

```bash
npm start
```

Starts the production server.

## 🚀 Deployment

The server can be deployed to platforms such as:

* Vercel
* Render
* Railway
* VPS
* Other Node.js-compatible hosting platforms

Before deployment, make sure all required environment variables are configured in the hosting platform.

## 🔧 Development Workflow

1. Clone the repository.
2. Install dependencies.
3. Configure `.env`.
4. Start MongoDB connection.
5. Run the development server.
6. Connect the Torlet client application.
7. Test authentication and API endpoints.

## 🐛 Troubleshooting

### MongoDB connection error

Check:

* `MONGODB_URI`
* MongoDB username/password
* MongoDB Atlas network access
* Database permissions

### CORS error

Make sure `CLIENT_URL` matches the frontend URL:

```env
CLIENT_URL=http://localhost:3000
```

### Authentication/session error

Check:

* Better Auth configuration
* Database adapter
* Environment variables
* Frontend and backend URLs
* Cookies/session configuration

## 🔐 Security

Do not expose sensitive information such as:

* MongoDB credentials
* Authentication secrets
* API keys
* Session secrets

Make sure `.env` is included in `.gitignore`:

```gitignore
.env
.env.local
.env.production
node_modules
dist
```

## 👨‍💻 Author

**Saymon Shifat**

Full Stack Developer
Bangladesh

## 📄 License

This project is developed for the **Torlet** application.

All rights reserved.
