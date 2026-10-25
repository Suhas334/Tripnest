# TripNest — Travel Itinerary Planner

A MERN stack travel planner (MongoDB, Express, React, Node). Sign up, create trips, build a day-by-day itinerary, and keep an eye on your budget — all in one place.

## Features

- Public landing page describing the app, with Login / Sign up at the top
- Sign up and log in (passwords hashed with bcrypt, JWT auth)
- Dashboard of your trips with search, trip count, and status (Upcoming / Ongoing / Completed)
- Create, view, edit and delete your own trips
- Add, edit, delete and mark day-wise places as visited
- Estimated place expenses tracked against each trip budget
- Responsive layout for mobile

## Tech

- **Frontend:** React 18, Vite, React Router, lucide-react icons
- **Backend:** Express, Mongoose, JWT, bcryptjs
- **Database:** MongoDB (local Community Server or a free Atlas cluster)

## Requirements

- Node.js 20.19+ or 22+
- MongoDB locally, or a free MongoDB Atlas database

## Setup (Windows PowerShell)

From the project root:

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
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string and allow the app's network/user in your Atlas settings. Don't commit `.env` or share your database password.

## Run

Make sure MongoDB is running, then from the project root:

```powershell
npm run dev
```

This starts the Vite frontend on `http://localhost:5173` and the Express API on port `5000`. The frontend proxies `/api` calls to the backend. Open `http://localhost:5173`, sign up, and create a trip.

## Quick test

1. Sign up, log out, then log back in.
2. Create a trip (e.g. Hyderabad, 2026-12-01 to 2026-12-03, budget ₹5000).
3. Add places on dates within the trip; adding one outside those dates is rejected.
4. Mark a place visited, edit it, check the totals update.
5. Search trips, edit trip details, delete a trip.
6. Register a second user and confirm they can't see the first user's trips.

## Folder structure

```text
travel-itinerary-planner/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/   # Layout, TripForm, PlaceForm
│   │   ├── context/      # AuthContext (JWT in localStorage)
│   │   ├── pages/        # Landing, Auth, Dashboard, TripDetails
│   │   ├── api.js        # Axios client
│   │   ├── main.jsx      # Routes
│   │   └── styles.css
│   └── vite.config.js
├── server/
│   ├── middleware/       # JWT token check
│   ├── models/           # User, Trip, Place
│   ├── routes/           # auth, trips (+ places)
│   ├── index.js          # Express app + DB connection
│   └── .env.example
└── README.md
```

## Routes

- `/` — public landing page
- `/login`, `/register` — auth (public)
- `/trips` — your dashboard (auth required)
- `/trips/:id` — trip itinerary (auth required)

## API

All trip and place endpoints require a valid JWT and only touch the signed-in user's data. `GET /api/health` returns `{ status: "ok" }`.

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/trips`, `POST /api/trips`
- `GET /api/trips/:id`, `PUT /api/trips/:id`, `DELETE /api/trips/:id`
- `GET /api/trips/:id/places`, `POST /api/trips/:id/places`
- `PUT /api/trips/:id/places/:placeId`, `DELETE /api/trips/:id/places/:placeId`

The token is stored in `localStorage` for simplicity. For a larger production app, prefer secure HttpOnly cookies, request rate limits, and automated tests.

## Production deploy (Render)

The Express server can serve the built React app in production.

1. Push the project root to a Git repo (`.env` is gitignored).
2. In Render, create a Web Service (Node environment) connected to your repo.
3. Build: `npm install && npm install --prefix server && npm install --prefix client && npm run build`
4. Start: `npm start`
5. Set env vars in Render: `MONGODB_URI` (Atlas), `JWT_SECRET`, `NODE_ENV=production`, and `CLIENT_URL` (your Render URL). The app uses Render's assigned `PORT`.
6. After deploy, check `/api/health`, then sign up and test the main flows.

Deployment needs your own Render / GitHub / MongoDB Atlas accounts.
