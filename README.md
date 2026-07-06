# Student Management System - Setup & Testing Guide

This guide covers everything you need to start, seed, and test the full-stack system locally.

## Prerequisite
Ensure you have MySQL running on `localhost:3306` with the `root` user and no password (or alter `backend/.env` with your actual credentials).

---

## 1. Start the Backend & Database

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Start the server (this will also automatically create the `school_management` database and required tables if they do not exist):
   ```bash
   npm run start
   ```
   *Expected output: "Database connected/initialized... Server is running on port 8081"*

---

## 2. Seed an Admin User

Since user registration is restricted to prevent unauthorized access, we use a script to inject the first Admin user.

1. Open a **second terminal** and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Run the seeding script:
   ```bash
   node create-admin.js
   ```
   *Expected output: It will confirm the creation of the user `admin` with password `password123`.*

---

## 3. Start the Frontend

1. Open a **third terminal** and navigate to the nested frontend folder:
   ```bash
   cd frontend/frontend
   ```
2. Start Vite:
   ```bash
   npm run dev
   ```
3. Open the Local URL returned in the terminal (usually `http://localhost:5173`).

---

## 4. Testing the Workflows

Once the app is running in your browser:

### Step A: Authentication
1. Wait to be redirected to the `/login` page.
2. Under Username type: `admin`
3. Under Password type: `password123`
4. Submit the form to enter the Dashboard. Note your token is active and persisting via `localStorage`.

### Step B: Core Entities CRUD (In Postman or via code additions later)
Currently, the UI tables are read-only mappings of the backend endpoints. To add mock data for you to see in the table, you can test your APIs using tools like Postman, Thunder Client, or cURL.

**1. Create a Course (POST http://localhost:8081/api/courses)**
*Must provide the Auth token generated during login (Bearer token).*
```json
{
  "course_code": "CS101",
  "course_name": "Introduction to Computer Science",
  "credits": 4,
  "description": "Learn the basics of programming."
}
```

**2. Create a Student (POST http://localhost:8081/api/students)**
```json
{
  "student_id": "STU2024001",
  "first_name": "Jane",
  "last_name": "Doe",
  "date_of_birth": "2000-05-15",
  "gender": "Female",
  "email": "jane.doe@example.com",
  "phone": "555-1234",
  "address": "123 Campus Drive"
}
```

**3. Enroll Student into Course (POST http://localhost:8081/api/academic/enroll)**
```json
{
  "student_id": 1,
  "course_id": 1,
  "semester": "Fall",
  "year": 2024
}
```

**4. Record a Grade (POST http://localhost:8081/api/academic/grade)**
```json
{
  "enrollment_id": 1,
  "grade_value": 94.5,
  "letter_grade": "A",
  "remarks": "Excellent midterms."
}
```

### Step C: UI Verification
Refresh your browser.
1. Click **Courses** on the sidebar. You should see CS101.
2. Click **Students**. You should see Jane Doe.
3. Click **Grades**. You should see Jane Doe enrolled in CS101 with an 'A' grade.

---

### Step D: Testing Database Drop (Optional reset)
If you ever want to wipe the slate clean to test edge cases:
1. Log into your MySQL shell or GUI client (like DBeaver or phpMyAdmin)
2. Run `DROP DATABASE school_management;`
3. Restart the backend server to let `initDB()` rebuild a blank schema structure.

