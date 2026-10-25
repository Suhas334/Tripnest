# TripNest — Travel Itinerary Planner

An FSD-II mini project built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js).

## Features

- Sign up and log in (passwords hashed with bcrypt, JWT authentication)
- Dashboard with trip count, destinations, planned budget and search
- Create, view, edit and delete your own trips
- Add, edit, delete and mark day-wise places as visited
- Track estimated place expenses against each trip budget
- Mobile-friendly layout

## Requirements

- Node.js 20.19+ or 22+
- MongoDB Community Server locally, **or** a free MongoDB Atlas database

## Setup in VS Code (Windows PowerShell)

Open this extracted folder in VS Code. In a terminal run:

```powershell
npm install
cd server
npm install
Copy-Item .env.example .env
cd ../client
npm install
cd ..
```

In `server/.env` set:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/travel_planner
JWT_SECRET=replace_with_a_long_random_secret_you_create
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection URI and ensure your Atlas network/user settings allow the app to connect. **Do not commit `.env` or share your database password.**

Make sure local MongoDB is running (or Atlas is available), then from the project root:

```powershell
npm run dev
```

Open `http://localhost:5173`, register an account, create a trip, then add some places.

The frontend runs on port 5173 and proxies `/api` calls to the Express backend on port 5000.

## Quick functional test

1. Register, then log out and log back in.
2. Create a trip (e.g. Hyderabad, 2026-12-01 to 2026-12-03, budget ₹5000).
3. Add places on dates within the trip; try adding one outside those dates (should be rejected).
4. Mark a place as visited, edit it and verify totals.
5. Search trips, edit trip details and delete a trip.
6. Register a second user and verify they cannot view the first user's trips.

## Deploy a single service to Render

This project supports serving the compiled React app from Express in production.

1. Push the **project root** to a private or public GitHub repository, making sure `.env` is ignored.
2. Set up MongoDB Atlas; create a database user and select an appropriate Atlas network access rule (avoid unrestricted access when possible).
3. In Render, create a **Web Service**, connect your repository, and choose Node environment.
4. Use build command:

   ```bash
   npm install && npm install --prefix server && npm install --prefix client && npm run build
   ```

5. Use start command:

   ```bash
   npm start
   ```

6. Set environment variables in the Render dashboard:

   - `MONGODB_URI`: your MongoDB Atlas connection string
   - `JWT_SECRET`: long, random secret
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: **your final Render URL** (e.g. `https://your-service.onrender.com`)

7. The app uses the `PORT` automatically assigned by Render. Once deployed, check `/api/health`, register, and test your main flows.

**Note:** Deployment requires your own Render/GitHub/MongoDB Atlas accounts and credentials; deploying has not been performed for you by this source package.

## Folder structure

```text
travel-itinerary-planner/
├── client/
│   ├── src/
│   │   ├── components/   # Layout, TripForm, PlaceForm
│   │   ├── context/      # Authentication state
│   │   ├── pages/        # Login/Register, Dashboard, TripDetails
│   │   ├── api.js        # Axios API client
│   │   ├── main.jsx      # Routing
│   │   └── styles.css    # Responsive layout
│   └── vite.config.js
├── server/
│   ├── middleware/       # JWT token checker
│   ├── models/           # Mongoose User, Trip, Place
│   ├── routes/           # Auth and trip/places APIs
│   ├── index.js          # Express API and DB connection
│   └── .env.example
└── README.md
```

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/trips`, `POST /api/trips`
- `GET /api/trips/:id`, `PUT /api/trips/:id`, `DELETE /api/trips/:id`
- `GET /api/trips/:id/places`, `POST /api/trips/:id/places`
- `PUT /api/trips/:id/places/:placeId`, `DELETE /api/trips/:id/places/:placeId`

All trip and place endpoints require authentication and check that the trip belongs to the signed-in user. For simplicity, the token is stored in browser localStorage; for larger production applications, prefer secure HttpOnly cookie-based sessions, request rate limits and more extensive automated tests.


## TripNest 2.0 interface

This edition replaces the left sidebar with a top navigation bar and shows trips as travel photo cards. The MongoDB schemas and API routes are unchanged. Photos are loaded from Unsplash when online; cards retain a background color if images fail.

If you previously downloaded TripNest, extract this ZIP as a separate folder or copy only `client/src/components/Layout.jsx`, `client/src/pages/Dashboard.jsx`, and `client/src/styles.css` into your existing project. Keep your working `server/.env` on your own computer; it is not included in the ZIP.
