# Student Management System

A full-stack web application built during my software engineering internship at Decode Lab. This project handles complete CRUD operations for managing student and teacher records, features real-time search and filtering, and provides an analytical dashboard overview of institutional enrollment data.

The application is fully deployed, featuring a separated architecture with the frontend hosted on Vercel and the backend hosted on Render.

## 🚀 Live Demo & Testing

You can access the live application here: 
👉 **[Live Link](https://student-management-system-2te1-odrcpi0ui-asurao9o.vercel.app/)**

### Guest Test Credentials
Feel free to log in using the following test accounts to explore the dashboard functionalities:

*   **Student Dashboard View:**
    *   **ID:** `2026`
    *   **Password:** `student123`
*   **Teacher Dashboard View:**
    *   **ID:** `GT1`
    *   **Password:** `teacher`

---

## 🛠️ Tech Stack

*   **Frontend:** React.js, Vite, HTML5, CSS3 / Tailwind CSS
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas
*   **Deployment:** Vercel (Frontend), Render (Backend)

---

## ✨ Features

*   **Authentication:** Dual login system tailored for both students and teachers.
*   **Comprehensive CRUD Ops:** Seamlessly create, read, update, and delete records for students and faculty.
*   **Real-time Analytics:** An interactive administrative dashboard visualizing total metrics and enrollment data.
*   **Advanced Data Controls:** Instantly filter, search, and sort through extensive data tables dynamically.
*   **Production Routing Configuration:** Seamless SPA client-side routing persistence via `vercel.json`.

---

## 💻 Local Installation & Setup

Follow these steps to get a local copy up and running on your machine:

### Prerequites
*   Node.js installed locally
*   A MongoDB Atlas database instance setup

### 1. Clone the Repository
```bash
git clone [https://github.com/Sahil-o9/student-management-system.git](https://github.com/Sahil-o9/student-management-system.git)
cd student-management-system

## 2. Backend Setup
Navigate to the server folder:

Bash
cd backend  # or your respective server folder name
Install backend dependencies:

Bash
npm install
Create a .env file in the root of your backend folder and add your environment configurations:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
Start the backend development server:

Bash
npm run dev # or npm start
###3. Frontend Setup
Open a new terminal tab and navigate to the frontend folder:

Bash
cd frontend
Install frontend dependencies:

Bash
npm install
Create a .env file in the root of your frontend folder to link your deployed backend or local host:

Code snippet
VITE_API_URL=http://localhost:5000
Spin up the Vite development server:

Bash
npm run dev
