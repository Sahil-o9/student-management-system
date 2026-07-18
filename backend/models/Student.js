const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    rollNumber: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    section: { type: String, required: true },
    course: { type: String, default: "" } 
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        // Convert ISO timestamps to a friendly local string format
        if (ret.createdAt) ret.createdAt = new Date(ret.createdAt).toLocaleString();
        if (ret.updatedAt) ret.updatedAt = new Date(ret.updatedAt).toLocaleString();
        
        // Security: Never leak passwords in API JSON payloads!
        delete ret.password; 
        delete ret.__v; // Cleans up the Mongoose version key too
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Student', StudentSchema);