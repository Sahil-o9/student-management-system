# Student Management System

A full-stack web application built during my software engineering internship at Decode Lab. This project handles complete CRUD operations for managing student and teacher records, features real-time analytics, and provides role-based dashboards for different user types.

The application is fully deployed, featuring a separated architecture with the frontend hosted on Vercel and the backend hosted on Render.

## 🚀 Live Demo & Testing

You can access the live application here:
👉 **[Live Link](https://student-management-system-2te1-odrcpi0ui-asurao9o.vercel.app/)**

### Guest Test Credentials

Feel free to log in using the following test accounts to explore the dashboard functionalities:

* **Student Dashboard View:**
  * **ID:** `2026`
  * **Password:** `student123`
* **Teacher Dashboard View:**
  * **ID:** `GT1`
  * **Password:** `teacher`

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, HTML5, CSS3 / Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## ✨ Features

* **Authentication:** Dual login system tailored for both students and teachers.
* **Comprehensive CRUD Operations:** Seamlessly create, read, update, and delete records for students and faculty.
* **Real-time Analytics:** An interactive administrative dashboard visualizing total metrics and enrollment data.
* **Advanced Data Controls:** Instantly filter, search, and sort through extensive data tables dynamically.
* **Production Routing Configuration:** Seamless SPA client-side routing persistence via `vercel.json`.

---

## 💻 Local Installation & Setup

Follow these steps to get a local copy up and running on your machine:

### Prerequisites

* Node.js installed locally
* A MongoDB Atlas database instance setup
* Git installed on your machine

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Sahil-o9/student-management-system.git
cd student-management-system
```

---

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with your environment configurations:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
```

Start the backend development server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

---

### 3. Frontend Setup

Open a new terminal window and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder to link your backend:

```
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port shown in your terminal)

---

## 📁 Project Structure

```
student-management-system/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── controllers/        # Business logic
│   └── .env                # Environment variables
├── frontend/               # React/Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app component
│   └── .env                # Environment variables
└── README.md
```

---

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Deployment

### Frontend (Vercel)
* Push your code to GitHub
* Connect your repository to Vercel
* Deploy with one click

### Backend (Render)
* Push your code to GitHub
* Create a new Web Service on Render
* Connect your repository and deploy

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Sahil** - [GitHub Profile](https://github.com/Sahil-o9)

---

## 💬 Support

If you have any questions or run into issues, feel free to open an issue on GitHub or contact me directly.
