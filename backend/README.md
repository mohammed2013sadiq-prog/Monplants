# MoPlants Backend API

Backend service for the MoPlants plant identification and care mobile application. Built with Node.js, Express, PostgreSQL, and Sequelize.

## Features
- **Authentication**: JWT & bcrypt for register, login, and user profile.
- **Species Database**: Rich botanical data including watering frequency, light requirements, soil, climate, toxicity, and care difficulty.
- **User Plants Collection**: Manage your personal indoor/outdoor garden.
- **Favorites**: Bookmark plant species.
- **Plant Care Reminders**: Scheduling and tracking watering, misting, and feeding routines.
- **Journal**: Care history log with photo, weather, and notes.
- **AI Endpoints**: Mock AI botanical identification and chat assistants.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=moplants
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key
   ```

3. Ensure PostgreSQL server is running and the database `moplants` is created.

4. Start the server:
   ```bash
   npm run dev
   # or
   npm start
   ```

5. Health check:
   - `GET http://localhost:3000/` -> `{"message": "MoPlants API is running"}`
