// ==========================================
// 📁 models/Teacher.js
// ==========================================

const mongoose =
  require("mongoose");

const bcrypt =
  require("bcryptjs");


// ==========================================
// 🎓 TEACHER SCHEMA
// ==========================================
const teacherSchema =
  new mongoose.Schema({

    // ======================================
    // 👤 NAME
    // ======================================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ======================================
    // 📧 EMAIL
    // ======================================
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,

      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter valid email",
      ],
    },

    // ======================================
    // 🔐 PASSWORD
    // ======================================
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // ======================================
    // 🏫 ASSIGNED CLASS
    // ======================================
    assignedClass: {
      type: String,
      default: null,
    },

    // ======================================
    // 👑 ROLE
    // ======================================
    role: {
      type: String,

      enum: [
        "admin",
        "teacher",
      ],

      default: "teacher",
    },

  }, {

    timestamps: true,
  });


// ==========================================
// 🔐 HASH PASSWORD BEFORE SAVE
// ==========================================
teacherSchema.pre(
  "save",

  async function () {

    // ======================================
    // SKIP IF PASSWORD NOT MODIFIED
    // ======================================
    if (
      !this.isModified(
        "password"
      )
    ) {

      return;
    }

    // ======================================
    // GENERATE SALT
    // ======================================
    const salt =
      await bcrypt.genSalt(
        10
      );

    // ======================================
    // HASH PASSWORD
    // ======================================
    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );
  }
);


// ==========================================
// 🔑 COMPARE PASSWORD
// ==========================================
teacherSchema.methods.comparePassword =
  async function (
    enteredPassword
  ) {

    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };


// ==========================================
// 🚫 REMOVE PASSWORD FROM RESPONSE
// ==========================================
teacherSchema.methods.toJSON =
  function () {

    const obj =
      this.toObject();

    delete obj.password;

    return obj;
  };


// ==========================================
// 📤 EXPORT MODEL
// ==========================================
module.exports =
  mongoose.model(
    "Teacher",
    teacherSchema
  );