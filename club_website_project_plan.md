# College Club Event Registration Website - Project Plan

## 1. Project Overview
A web application designed for a college club to list upcoming events and allow students to register seamlessly. The platform includes a secure admin portal for organizers to manage events, track registrations, verify payments via screenshots, and export attendee data.

## 2. User Roles

### A. Normal User (Student/Participant)
*   **No Login Required:** Anyone can access the public-facing pages.
*   **View Events:** Can browse a list of upcoming and past events.
*   **Register:** Can fill out a registration form for specific events.

### B. Organizer (Admin)
*   **Authentication:** Secure login portal (username/password).
*   **Event Management:** (Optional but recommended) Add, edit, or delete events.
*   **Registration Dashboard:** View a table of all registered users for each event.
*   **Data Export:** Download registration data (including payment status) as an `.xlsx` (Excel) or `.csv` file.

## 3. Core Features & Flow

### Public Pages
1.  **Home/Events Page:** Displays event cards with title, date, time, venue, and fee.
2.  **Registration Form:**
    *   Full Name
    *   Email Address
    *   Phone Number
    *   College ID / Roll Number
    *   **Payment Screenshot Upload:** A file upload field (accepting .jpg, .png, .pdf) for the payment receipt.
    *   Submit button that saves data to the database.

### Admin Portal
1.  **Login Page:** Simple admin authentication.
2.  **Admin Dashboard:**
    *   Select an event to view its registrants.
    *   View user details and click to view/download the payment screenshot.
    *   **Export Button:** Generates an Excel sheet containing all the text details of the registrants.

## 4. Recommended Tech Stack
*   **Frontend:** React.js or Next.js (with Tailwind CSS for styling).
*   **Backend:** Node.js with Express, or Python with Django/FastAPI. (Alternatively, a Backend-as-a-Service like Firebase or Supabase is excellent for rapid development).
*   **Database:** MongoDB (NoSQL) or PostgreSQL (SQL) to store user and event data.
*   **File Storage:** AWS S3, Cloudinary, or Firebase Storage to securely store the uploaded payment screenshots.
*   **Excel Export:** Libraries like `xlsx` (SheetJS) or `react-csv` for the frontend.

## 5. Database Schema Idea (Simplified)

**Registrations Table/Collection:**
*   `id` (Unique ID)
*   `eventId` (Reference to the event)
*   `fullName` (String)
*   `email` (String)
*   `phone` (String)
*   `rollNumber` (String)
*   `paymentScreenshotUrl` (String - URL to the stored image)
*   `registrationDate` (Timestamp)