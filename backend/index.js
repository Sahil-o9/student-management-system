const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Model & Route Imports
const Teacher = require('./models/Teacher');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Link Routes (Must be mounted before starting the server!)
app.use('/api/students', studentRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('Student Management System API is running...');
});

// Temporary Seeding Function (Safe to run once connected)
const seedTeacher = async () => {
  try {
    const existing = await Teacher.findOne({ teacherId: "T101" });
    if (!existing) {
      await Teacher.create({
        teacherId: "T101",
        name: "Professor Smith",
        email: "smith@college.edu",
        password: "admin"
      });
      console.log("✅ SEED SUCCESS: Account T101 created!");
    } else {
      console.log("ℹ️ Teacher T101 already exists in database.");
    }
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

// MongoDB Connection & Server Initialization
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("🔌 Connected to MongoDB Atlas successfully!");
    
    // Seed the default teacher account only AFTER successfully connecting to the DB
    await seedTeacher();

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server is humming on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });