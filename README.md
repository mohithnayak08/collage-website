# College Club Event Registration Web Application

Full-stack web application built according to [club_website_project_plan.md](club_website_project_plan.md).

## Tech Stack
- **Frontend**: React (Vite), React Router, Axios, Lucide Icons, CSS3.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt.js.
- **File Handling**: Multer (stores payment receipts in `/server/uploads`).
- **Data Export**: ExcelJS (exports formatted `.xlsx` attendee spreadsheets).

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally (or MongoDB Atlas URI)

### 2. Backend Setup
1. Navigate to `/server`:
   ```bash
   cd server
   ```
2. Verify `.env` settings:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/college_club_db
   JWT_SECRET=your_jwt_secret_key_change_in_production
   CLIENT_URL=http://localhost:5173
   ```
3. Optional: Seed default Admin and sample events:
   ```bash
   node seed.js
   ```
   *Default Admin credentials:*
   - **Username**: `admin`
   - **Password**: `adminpassword123`
4. Start the backend:
   ```bash
   npm run dev
   # or
   npm start
   ```

### 3. Frontend Setup
1. Navigate to `/client`:
   ```bash
   cd client
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## Features
- **Public Events**: Browse active club events with date, time, venue, and fee.
- **Student Registration**: Form with duplicate submission check and receipt screenshot upload.
- **Admin Authentication**: JWT-based login with bcrypt password hashing.
- **Admin Dashboard**:
  - Filter registrations by event.
  - Review receipts and mark registrations as `verified`, `pending`, or `rejected`.
  - Create and delete events.
  - One-click Excel `.xlsx` attendee list download.
