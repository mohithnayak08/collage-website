# College Club Event Registration Web Application

Full-stack web application built according to [club_website_project_plan.md](club_website_project_plan.md).

## Tech Stack
- **Frontend**: React (Vite), React Router, Axios, Lucide Icons, CSS3.
- **Backend**: Node.js, Express, PostgreSQL (Sequelize), JWT, Bcrypt.js.
- **File Handling**: Multer (stores payment receipts in `/server/uploads`).
- **Data Export**: ExcelJS (exports formatted `.xlsx` attendee spreadsheets).

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- A PostgreSQL database, such as [Neon](https://neon.tech/)

### 2. Backend Setup
1. Navigate to `/server`:
   ```bash
   cd server
   ```
2. Verify `.env` settings:
   ```env
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=replace_with_a_long_random_secret
   CLIENT_URL=http://localhost:5173
   ```
3. Optional: Seed sample data and the default admin:
   ```bash
   node seed.js
   ```
   *Default Admin credentials (only created when no `admin` user exists):*
   - **Username**: `admin`
   - **Password**: `adminpassword123`

   If an `admin` user already exists, running the seed script does not change its password.
   You can create another organizer account with:
   ```powershell
   $body = @{
     username = "yourusername"
     email    = "you@example.com"
     password = "YourStrongPassword123!"
   } | ConvertTo-Json

   Invoke-RestMethod `
     -Uri "http://localhost:5000/api/auth/register" `
     -Method Post `
     -ContentType "application/json" `
     -Body $body
   ```
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
