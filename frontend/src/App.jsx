import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://student-management-system-ers5.onrender.com/api/students';

function App() {
  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(''); // 'admin', 'teacher', or 'student'
  const [currentUser, setCurrentUser] = useState(null);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Password Visibility Toggle State
  const [showPassword, setShowPassword] = useState(false);

  // Tab State for Super Admin (Sahil)
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'teachers'

  // Data Directory Filters
  const [selectedSection, setSelectedSection] = useState('');
  const [searchName, setSearchName] = useState('');
  const [loadingDirectory, setLoadingDirectory] = useState(false);

  // Data Lists
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Form States (Replaced grade with section, added phone number)
  const [studentForm, setStudentForm] = useState({
    rollNumber: '', firstName: '', lastName: '', email: '', course: '', section: 'A', phone: '', password: ''
  });
  const [teacherForm, setTeacherForm] = useState({
    teacherId: '', name: '', email: '', password: ''
  });

  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Sync data on login or filter criteria changes
  useEffect(() => {
    if (isLoggedIn) {
      if (userRole === 'admin' || userRole === 'teacher') {
        fetchStudents();
      }
      if (userRole === 'admin') {
        fetchTeachers();
      }
    }
  }, [isLoggedIn, userRole, selectedSection, searchName]);

  const fetchStudents = async () => {
    setLoadingDirectory(true);
    try {
      const params = new URLSearchParams();
      if (selectedSection) params.append('section', selectedSection);
      if (searchName) params.append('name', searchName);

      // Uses the new searchable backend path if filtering, else standard route
      const url = (selectedSection || searchName) 
        ? `${API_URL}/search?${params.toString()}` 
        : API_URL;

      const res = await axios.get(url);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoadingDirectory(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_URL}/teachers`);
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { id: loginId, password: loginPassword });
      setIsLoggedIn(true);
      setUserRole(res.data.role);
      setCurrentUser(res.data.user);
      setLoginId('');
      setLoginPassword('');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setCurrentUser(null);
    setIsEditing(false);
    setActiveTab('students');
    setSelectedSection('');
    setSearchName('');
  };

  // Create Student
 // Create Student
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...studentForm, password: studentForm.password || 'student123' };
      await axios.post(`${API_URL}/add`, payload);
      alert(`Student Registered! Login using ID: ${payload.rollNumber} / Password: ${payload.password}`);
      fetchStudents();
      
      // ✅ ENSURE PHONE RESETS TO AN EMPTY STRING HERE TOO
      setStudentForm({ rollNumber: '', firstName: '', lastName: '', email: '', course: '', section: 'A', phone: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating student');
    }
  };
  // Create Teacher (Admin Only)
  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/teachers/add`, teacherForm);
      alert('Teacher account registered successfully!');
      fetchTeachers();
      setTeacherForm({ teacherId: '', name: '', email: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating teacher');
    }
  };

  // Update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/rollNumber/${editData.rollNumber}`, editData);
      alert('Updated successfully!');
      setIsEditing(false);
      if (userRole === 'admin' || userRole === 'teacher') {
        fetchStudents();
      } else {
        setCurrentUser(editData);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating record');
    }
  };

  // Delete Student
  const handleDeleteStudent = async (roll) => {
    if (window.confirm(`Delete student record ${roll}?`)) {
      try {
        await axios.delete(`${API_URL}/rollNumber/${roll}`);
        if (userRole === 'student') {
          alert('Account deleted.');
          handleLogout();
        } else {
          fetchStudents();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Delete Teacher
  const handleDeleteTeacher = async (id) => {
    if (window.confirm(`Delete teacher account ${id}?`)) {
      try {
        await axios.delete(`${API_URL}/teachers/${id}`);
        fetchTeachers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ==========================================
  // STYLES
  // ==========================================
  const styles = {
    container: { padding: '30px 20px', fontFamily: '"Segoe UI", sans-serif', maxWidth: '1100px', margin: '0 auto', color: '#333' },
    card: { background: '#ffffff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '450px', margin: '100px auto' },
    formWrapper: { background: '#f8f9fa', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box', marginBottom: '15px' },
    btnPrimary: { padding: '12px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    btnSecondary: { padding: '10px 15px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' },
    btnDanger: { padding: '8px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
    th: { background: '#007bff', color: '#fff', padding: '12px', textAlign: 'left' },
    td: { padding: '12px', borderBottom: '1px solid #dee2e6', backgroundColor: '#fff' },
    tabButton: (isActive) => ({
      padding: '10px 20px',
      marginRight: '10px',
      background: isActive ? '#007bff' : '#e2e8f0',
      color: isActive ? '#fff' : '#333',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold'
    })
  };

  // ==========================================
  // RENDER INTERFACES
  // ==========================================

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '25px' }}>University Portal</h2>
          <form onSubmit={handleLogin}>
            <label style={{ fontWeight: '600' }}>User ID / Roll Number</label>
            <input type="text" placeholder="ID (e.g. sahil, T101, or 10245)" value={loginId} onChange={(e) => setLoginId(e.target.value)} style={styles.input} required />
            
            <label style={{ fontWeight: '600' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                style={styles.input} 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            <button type="submit" style={{ ...styles.btnPrimary, width: '100%', marginTop: '10px' }}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
        <div>
          <h1>{userRole === 'admin' ? 'Super Admin Portal' : userRole === 'teacher' ? 'Instructor Portal' : 'Student Portal'}</h1>
          <p>Welcome, <strong>{currentUser?.name || `${currentUser?.firstName} ${currentUser?.lastName}`}</strong></p>
        </div>
        <button onClick={handleLogout} style={{ ...styles.btnDanger, padding: '10px 20px' }}>Logout</button>
      </div>

      {/* 1. SUPER ADMIN & TEACHER VIEW */}
      {(userRole === 'admin' || userRole === 'teacher') && (
        <div>
          {/* Admin Navigation Tabs */}
          {userRole === 'admin' && (
            <div style={{ marginBottom: '25px' }}>
              <button style={styles.tabButton(activeTab === 'students')} onClick={() => setActiveTab('students')}>Manage Students</button>
              <button style={styles.tabButton(activeTab === 'teachers')} onClick={() => setActiveTab('teachers')}>Manage Teachers</button>
            </div>
          )}

          {/* Tab content: students */}
          {activeTab === 'students' && (
            <div>
              {/* STUDENT CREATE / EDIT FORM */}
              <div style={styles.formWrapper}>
                {isEditing ? (
                  <div>
                    <h3 style={{ color: '#ffc107', marginTop: 0 }}>Edit Student Record</h3>
                    <form onSubmit={handleUpdateSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                        <input type="number" name="rollNumber" value={editData.rollNumber} style={styles.input} disabled />
                        <input type="text" value={editData.firstName} style={styles.input} onChange={(e) => setEditData({...editData, firstName: e.target.value})} required />
                        <input type="text" value={editData.lastName} style={styles.input} onChange={(e) => setEditData({...editData, lastName: e.target.value})} required />
                        <input type="email" value={editData.email} style={styles.input} onChange={(e) => setEditData({...editData, email: e.target.value})} required />
                        <input type="text" value={editData.course} style={styles.input} onChange={(e) => setEditData({...editData, course: e.target.value})} required />
                        <input type="number" value={editData.phone || ''} placeholder="Phone Number" style={styles.input} onChange={(e) => setEditData({...editData, phone: e.target.value})} required />
                        <select value={editData.section} style={styles.input} onChange={(e) => setEditData({...editData, section: e.target.value})}>
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                          <option value="C">Section C</option>
                          <option value="D">Section D</option>
                        </select>
                      </div>
                      <button type="submit" style={{ ...styles.btnPrimary, background: '#ffc107', color: '#000', marginRight: '10px' }}>Save Changes</button>
                      <button type="button" onClick={() => setIsEditing(false)} style={styles.btnSecondary}>Cancel</button>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ marginTop: 0 }}>Register New Student</h3>
                    <form onSubmit={handleStudentSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                        <input type="number" placeholder="Roll Number" value={studentForm.rollNumber} style={styles.input} onChange={(e) => setStudentForm({...studentForm, rollNumber: e.target.value})} required />
                        <input type="text" placeholder="First Name" value={studentForm.firstName} style={styles.input} onChange={(e) => setStudentForm({...studentForm, firstName: e.target.value})} required />
                        <input type="text" placeholder="Last Name" value={studentForm.lastName} style={styles.input} onChange={(e) => setStudentForm({...studentForm, lastName: e.target.value})} required />
                        <input type="email" placeholder="Email" value={studentForm.email} style={styles.input} onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} required />
                        <input type="text" placeholder="Course" value={studentForm.course} style={styles.input} onChange={(e) => setStudentForm({...studentForm, course: e.target.value})} required />
                        <input type="number" placeholder="Phone Number" value={studentForm.phone} style={styles.input} onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})} required />
                        <input type="password" placeholder="Password (default: student123)" value={studentForm.password} style={styles.input} onChange={(e) => setStudentForm({...studentForm, password: e.target.value})} />
                        <select value={studentForm.section} style={styles.input} onChange={(e) => setStudentForm({...studentForm, section: e.target.value})}>
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                          <option value="C">Section C</option>
                          <option value="D">Section D</option>
                        </select>
                      </div>
                      <button type="submit" style={styles.btnPrimary}>Add Student Record</button>
                    </form>
                  </div>
                )}
              </div>

              {/* SECTION FILTERS AND DATABASE DIRECTORY */}
              <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>🔎 Section Search & Category Filters</h4>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '150px' }}>
                    <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} style={{ ...styles.input, marginBottom: 0 }}>
                      <option value="">-- All Sections --</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>
                  <div style={{ flex: '2', minWidth: '250px' }}>
                    <input type="text" placeholder="Search by first or last name..." value={searchName} onChange={(e) => setSearchName(e.target.value)} style={{ ...styles.input, marginBottom: 0 }} />
                  </div>
                </div>
              </div>

              <h3>Student Database</h3>
              {loadingDirectory ? (
                <p style={{ color: '#007bff' }}>Updating directory view...</p>
              ) : students.length > 0 ? (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Roll No</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Phone</th>
                      <th style={styles.th}>Course</th>
                      <th style={styles.th}>Section</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((std) => (
                      <tr key={std.rollNumber}>
                        <td style={styles.td}><strong>{std.rollNumber}</strong></td>
                        <td style={styles.td}>{std.firstName} {std.lastName}</td>
                        <td style={styles.td}>{std.email}</td>
                        <td style={styles.td}>{std.phone || 'N/A'}</td>
                        <td style={styles.td}>{std.course}</td>
                        <td style={styles.td}>
                          <span style={{ backgroundColor: '#e2e8f0', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                            {std.section}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button onClick={() => { setIsEditing(true); setEditData(std); }} style={styles.btnSecondary}>Edit</button>
                          <button onClick={() => handleDeleteStudent(std.rollNumber)} style={styles.btnDanger}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No students found matching current filters.</p>
              )}
            </div>
          )}

          {/* Tab content: teachers */}
          {userRole === 'admin' && activeTab === 'teachers' && (
            <div>
              <div style={styles.formWrapper}>
                <h3 style={{ marginTop: 0 }}>Register New Instructor</h3>
                <form onSubmit={handleTeacherSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <input type="text" placeholder="Teacher ID (e.g. T102)" value={teacherForm.teacherId} style={styles.input} onChange={(e) => setTeacherForm({...teacherForm, teacherId: e.target.value})} required />
                    <input type="text" placeholder="Name" value={teacherForm.name} style={styles.input} onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})} required />
                    <input type="email" placeholder="Email" value={teacherForm.email} style={styles.input} onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})} required />
                    <input type="password" placeholder="Password" value={teacherForm.password} style={styles.input} onChange={(e) => setTeacherForm({...teacherForm, password: e.target.value})} required />
                  </div>
                  <button type="submit" style={styles.btnPrimary}>Register Teacher</button>
                </form>
              </div>

              <h3>Teacher Database</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Teacher ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((tch) => (
                    <tr key={tch.teacherId}>
                      <td style={styles.td}><strong>{tch.teacherId}</strong></td>
                      <td style={styles.td}>{tch.name}</td>
                      <td style={styles.td}>{tch.email}</td>
                      <td style={styles.td}>
                        <button onClick={() => handleDeleteTeacher(tch.teacherId)} style={styles.btnDanger}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. INDIVIDUAL STUDENT PORTAL VIEW */}
      {userRole === 'student' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div style={styles.formWrapper}>
            <h3 style={{ marginTop: 0, color: '#007bff' }}>Academic & Personal Record</h3>
            <hr style={{ border: 'none', height: '1px', background: '#ddd', margin: '15px 0' }} />
            <p><strong>Roll Number:</strong> {currentUser?.rollNumber}</p>
            <p><strong>Full Name:</strong> {currentUser?.firstName} {currentUser?.lastName}</p>
            <p><strong>Email Address:</strong> {currentUser?.email}</p>
            <p><strong>Phone Number:</strong> {currentUser?.phone || 'Not Provided'}</p>
            <p><strong>Assigned Course:</strong> {currentUser?.course}</p>
            <p><strong>Assigned Section:</strong> <span style={{ padding: '4px 8px', background: '#28a745', color: '#fff', borderRadius: '3px', fontWeight: 'bold' }}>Section {currentUser?.section}</span></p>

            <div style={{ marginTop: '30px' }}>
              <button onClick={() => { setIsEditing(true); setEditData(currentUser); }} style={{ ...styles.btnPrimary, marginRight: '10px' }}>Update Profile Info</button>
              <button onClick={() => handleDeleteStudent(currentUser.rollNumber)} style={styles.btnDanger}>Delete My Account</button>
            </div>
          </div>

          {isEditing && (
            <div style={styles.formWrapper}>
              <h3 style={{ color: '#ffc107', marginTop: 0 }}>Update Personal Information</h3>
              <form onSubmit={handleUpdateSubmit}>
                <input type="text" value={editData.firstName} style={styles.input} onChange={(e) => setEditData({...editData, firstName: e.target.value})} required />
                <input type="text" value={editData.lastName} style={styles.input} onChange={(e) => setEditData({...editData, lastName: e.target.value})} required />
                <input type="email" value={editData.email} style={styles.input} onChange={(e) => setEditData({...editData, email: e.target.value})} required />
                <input type="number" value={editData.phone || ''} placeholder="Phone Number" style={styles.input} onChange={(e) => setEditData({...editData, phone: e.target.value})} required />
                <input type="text" value={editData.course} style={styles.input} onChange={(e) => setEditData({...editData, course: e.target.value})} required />
                <button type="submit" style={{ ...styles.btnPrimary, background: '#ffc107', color: '#000', marginRight: '10px' }}>Save Details</button>
                <button type="button" onClick={() => setIsEditing(false)} style={styles.btnSecondary}>Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;