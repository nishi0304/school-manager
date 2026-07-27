# School Register

A school management system with attendance (camera + GPS), fees, salary, timetable, and quick-links to Instagram/Facebook/WhatsApp/Call.

## Setup

```bash
npm install
```

1. Create a Firebase project at https://console.firebase.google.com
2. Add a Web App, copy its config into `src/firebase.js`
3. In the Firebase console enable:
   - Authentication → Email/Password
   - Firestore Database
   - Storage
4. Create a `users` collection in Firestore. Each doc id = the Auth UID, with fields:
   ```json
   { "name": "Jane Doe", "role": "admin" }
   ```
   (`role` is `admin`, `teacher`, or `student`)

## Run locally

```bash
npm run dev
```

## What's wired up vs. sample data

- **Attendance** (`src/pages/Attendance.jsx`) — fully wired: opens the camera, captures a photo, gets GPS location, uploads to Firebase Storage, and writes a record to the `attendance` Firestore collection. Optionally set `SCHOOL_COORDS` at the top of the file to flag check-ins outside a campus radius.
- **Fees, Salary, Timetable** — UI is built with sample data; swap the `SAMPLE_*` arrays for Firestore queries once your data model is ready (see comments in each file for the expected collection shape).
- **Quick Links** — fully working deep links to Instagram, Facebook, WhatsApp, and phone calls; just fill in your school's handles/numbers (or wire to Firestore settings).

## Project structure

```
src/
  firebase.js           Firebase config + exports (auth, db, storage)
  context/AuthContext   Login/logout + current user profile & role
  components/Layout     Sidebar navigation shell
  pages/
    Login, Dashboard, Attendance, Fees, Salary, Timetable, QuickLinks
```

## Notes

- Built as a responsive web app (works great as a home-screen PWA on phones — camera & GPS both work through the browser).
- Add role-based restrictions (e.g. only admins see Salary) in `RequireAuth` / `App.jsx` once your roles are defined.
