const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// ==========================================
// 1. AUTHENTICATION ROUTE (Admin, Teacher, & Student Login)
// ==========================================
router.post('/login', async (req, res) => {
  const { id, password } = req.body;

  console.log(`🔑 Login attempt - ID received: "${id}", Password received: "${password}"`);

  try {
    const normalizedId = String(id || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();

    // 1. Super Admin (Sahil)
    if (normalizedId === 'sahil' && cleanPassword === 'admin123') {
      console.log("👑 Super Admin 'sahil' logged in successfully!");
      return res.status(200).json({
        role: 'admin',
        user: { id: 'sahil', name: 'Sahil (Super Admin)', email: 'sahil@college.edu' }
      });
    }

    // 2. Teacher Check
    const teacher = await Teacher.findOne({ teacherId: { $regex: new RegExp(`^${normalizedId}$`, 'i') } });
    if (teacher) {
      if (teacher.password === cleanPassword) {
        console.log(`👨‍🏫 Teacher '${teacher.name}' logged in successfully!`);
        return res.status(200).json({
          role: 'teacher',
          user: { id: teacher.teacherId, name: teacher.name, email: teacher.email }
        });
      } else {
        return res.status(401).json({ message: "Invalid password." });
      }
    }

    // 3. Student Check
    const numericRoll = Number(normalizedId);
    if (!isNaN(numericRoll) && normalizedId !== '') {
      const student = await Student.findOne({ rollNumber: numericRoll });
      if (student) {
        if (student.password === cleanPassword) {
          console.log(`🎓 Student '${student.firstName}' logged in successfully!`);
          return res.status(200).json({
            role: 'student',
            user: student
          });
        } else {
          return res.status(401).json({ message: "Invalid password." });
        }
      }
    }

    console.log(`❌ Login failed: No user found matching ID "${id}"`);
    return res.status(404).json({ message: "User profile not found with that ID." });
  } catch (error) {
    console.error("🔥 Login error:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 2. TEACHER MANAGEMENT ROUTES (Admin Only)
// ==========================================

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register a new teacher
router.post('/teachers/add', async (req, res) => {
  try {
    const { teacherId, name, email, password } = req.body;
    const newTeacher = new Teacher({ teacherId, name, email, password });
    await newTeacher.save();
    res.status(201).json({ message: "Teacher registered successfully!", teacher: newTeacher });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A teacher with this ID or Email already exists." });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete a teacher
router.delete('/teachers/:teacherId', async (req, res) => {
  try {
    const deleted = await Teacher.findOneAndDelete({ teacherId: req.params.teacherId });
    if (!deleted) {
      return res.status(404).json({ message: "Teacher not found." });
    }
    res.status(200).json({ message: "Teacher successfully removed." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 3. STUDENT CRUD ROUTES (Admin & Teacher Control)
// ==========================================

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register student
router.post('/add', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully!", student: newStudent });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A student with this Roll Number or Email already exists." });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update student
router.put('/rollNumber/:rollNumber', async (req, res) => {
  try {
    const roll = Number(req.params.rollNumber);
    if (isNaN(roll)) {
      return res.status(400).json({ message: "Invalid roll number format." });
    }
    const updatedStudent = await Student.findOneAndUpdate(
      { rollNumber: roll },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student record not found." });
    }
    return res.status(200).json({ message: "Record updated successfully!", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete student
router.delete('/rollNumber/:rollNumber', async (req, res) => {
  try {
    const roll = Number(req.params.rollNumber);
    if (isNaN(roll)) {
      return res.status(400).json({ message: "Invalid roll number format." });
    }
    const deletedStudent = await Student.findOneAndDelete({ rollNumber: roll });
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student record not found." });
    }
    return res.status(200).json({ message: "Student successfully removed." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 4. SEARCH & CATEGORIZE BY SECTION ROUTE
// ==========================================
router.get('/search', async (req, res) => {
  try {
    const { section, name } = req.query;
    let queryConditions = {};

    if (section) {
      queryConditions.section = { $regex: `^${section.trim()}$`, $options: 'i' }; 
    }

    if (name) {
      queryConditions.$or = [
        { firstName: { $regex: name.trim(), $options: 'i' } },
        { lastName: { $regex: name.trim(), $options: 'i' } }
      ];
    }

    const students = await Student.find(queryConditions).sort({ rollNumber: 1 });
    return res.status(200).json(students);
  } catch (error) {
    console.error("🔥 Search error:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;