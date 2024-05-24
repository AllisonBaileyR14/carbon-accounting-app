# Full-Stack Template Application

This project is a full-stack template application using Docker, Koa, MongoDB, TypeScript for the backend, and React with Vite for the frontend. It includes environment configuration and Axios for HTTP handling.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Contributing](#contributing)
- [License](#license)

## Features

- Backend built with Koa, TypeScript, and MongoDB using Mongoose
- Frontend built with React, Vite, and Axios for HTTP requests
- Docker setup for easy containerization and deployment
- Environment configuration using `.env` files
- Example API endpoints and frontend integration

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/fullstack-template-app.git
    cd fullstack-template-app
    ```

2. **Install dependencies**:
    Navigate to both `backend` and `frontend` directories and install the required packages.
    
    For backend:
    ```sh
    cd backend
    npm install
    ```

    For frontend:
    ```sh
    cd ../frontend
    npm install
    ```

3. **Setup environment variables**:
    Create a `.env` file in the `backend` directory and add your MongoDB connection string.
    ```env
    MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/database?retryWrites=true&w=majority
    PORT=8080
    ```

## Project Structure

fullstack-template-app/
├── backend/
│ ├── .env
│ ├── Dockerfile
│ ├── package.json
│ ├── tsconfig.json
│ ├── src/
│ │ ├── db.ts
│ │ ├── index.ts
│ │ ├── models/
│ │ │ └── Message.ts
│ │ └── routes.ts
├── frontend/
│ ├── Dockerfile
│ ├── package.json
│ ├── tsconfig.json
│ ├── vite.config.ts
│ ├── index.html
│ ├── public/
│ └── src/
│ ├── App.tsx
│ ├── main.tsx
│ ├── components/
│ │ └── ExampleComponent.tsx
│ └── services/
│ └── api.ts
├── docker-compose.yml
└── README.md


## Running the Application

### Using Docker

1. **Build and run the Docker containers**:
    ```sh
    docker-compose up -d --build
    ```

2. **Check the status of the containers**:
    ```sh
    docker-compose ps
    ```

3. **View logs** (optional):
    ```sh
    docker-compose logs -f
    ```

4. **Stop the containers**:
    ```sh
    docker-compose down
    ```

### Without Docker

1. **Run the backend**:
    ```sh
    cd backend
    npm run dev
    ```

2. **Run the frontend**:
    ```sh
    cd ../frontend
    npm run dev
    ```

## API Endpoints

### GET /api/hello

- **Description**: Fetch all messages.
- **Response**:
  ```json
  [
    {
      "text": "Hello, world!"
    }
  ]

POST /api/hello
Description: Add a new message.

Request Body:
```json
{
  "text": "Your message here"
}


Response:

{
  "text": "Your message here"
}

Environment Variables
The application uses a .env file to manage environment variables. Ensure you have a .env file in the backend directory with the following content:

MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/database?retryWrites=true&w=majority

Docker Setup
The application uses Docker for containerization. The docker-compose.yml file defines three services:

backend: The Koa server running on Node.js
frontend: The React application served by Vite
mongo: The MongoDB database

To build and run the application in Docker containers, use:

 ```sh
docker-compose up -d --build
```

Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or suggestions.

License
This project is licensed under the MIT License. See the LICENSE file for more details.


This `README.md` file provides a comprehensive overview of the project, including features, installation steps, project structure, running the application with and without Docker, API endpoints, environment variables, Docker setup, contributing guidelines, and licensing information. Feel free to modify it to suit your project's specifics.
