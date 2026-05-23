const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  rollNumber: {
    type: String,
    required: true,
    trim: true
  },

  className: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },

  parentEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use valid email"]
  }

}, {
  timestamps: true
});


// 🔐 COMPOUND INDEX (no duplicate roll no in same class)
studentSchema.index({ rollNumber: 1, className: 1 }, { unique: true });


// 📤 CLEAN RESPONSE
studentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};


// 🔍 STATIC METHOD (get students by class)
studentSchema.statics.getByClass = function (className) {
  return this.find({ className });
};


module.exports = mongoose.model("Student", studentSchema);