// routes/adminRoutes.js

const router =
  require("express").Router();

const bcrypt =
  require("bcryptjs");

const Admin =
  require("../models/Admin");

const Teacher =
  require("../models/Teacher");

const Student =
  require("../models/Student");


// ==========================================
// 🔐 MIDDLEWARE
// ==========================================
const auth =
  require("../middleware/auth");

const {
  adminOnly,
} = require("../middleware/auth");


// ==========================================
// 👑 CREATE ADMIN
// ==========================================
router.post(
  "/create-admin",

  auth,

  adminOnly,

  async (req,res) => {
    try {

      const {
        name,
        email,
        password,
      } = req.body;

      // validation
      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,

          message:
            "All fields are required",
        });
      }

      // existing check
      const existingAdmin =
        await Admin.findOne({
          email,
        });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,

          message:
            "Admin already exists",
        });
      }

      // hash password
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // create admin
      const admin = new Admin({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });

      await admin.save();

      res.status(201).json({
        success: true,

        message:
          "Admin created successfully",

        admin,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,

        message: "Server error",
      });
    }
  }
);


// ==========================================
// 👨‍🏫 CREATE TEACHER
// ==========================================
router.post(
  "/create-teacher",

  auth,

  adminOnly,

  async (req,res) => {
    try {

      const {
        name,
        email,
        password,
        assignedClass,
      } = req.body;

      // validation
      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,

          message:
            "All fields are required",
        });
      }

      // existing teacher
      const existingTeacher =
        await Teacher.findOne({
          email,
        });

      if (existingTeacher) {
        return res.status(400).json({
          success: false,

          message:
            "Teacher already exists",
        });
      }

      // hash password
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // create teacher
      const teacher = new Teacher({
        name,
        email,
        password: hashedPassword,
        role: "teacher",
        assignedClass:
          assignedClass || null,
      });

      await teacher.save();

      res.status(201).json({
        success: true,

        message:
          "Teacher created successfully",

        teacher,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,

        message: "Server error",
      });
    }
  }
);


// ==========================================
// 📋 GET ALL ADMINS
// ==========================================
router.get(
  "/admins",

  auth,

  adminOnly,

  async (req,res) => {
    try {

      const admins =
        await Admin.find().select(
          "-password"
        );

      res.status(200).json({
        success: true,

        admins,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,

        message: "Server error",
      });
    }
  }
);


// ==========================================
// 📋 GET ALL TEACHERS
// ==========================================
router.get(
  "/teachers",

  auth,

  adminOnly,

  async (req,res) => {
    try {

      const teachers =
        await Teacher.find().select(
          "-password"
        );

      res.status(200).json({
        success: true,

        teachers,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,

        message: "Server error",
      });
    }
  }
);

// ==========================================
// 🎓 GET ALL STUDENTS
// ==========================================
router.get(
  "/students",

  auth,

  adminOnly,

  async (req,res) => {
    try {

      const students =
        await Student.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,

        students,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,

        message: "Server error",
      });
    }
  }
);
// ==========================================
// ❌ DELETE TEACHER
// ==========================================
router.delete(
  "/teacher/:id",

  auth,

  adminOnly,

  async (req,res) => {
    try {

      const teacher =
        await Teacher.findByIdAndDelete(
          req.params.id
        );

      if (!teacher) {
        return res.status(404).json({
          success: false,

          message:
            "Teacher not found",
        });
      }

      res.status(200).json({
        success: true,

        message:
          "Teacher deleted successfully",
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,

        message: "Server error",
      });
    }
  }
);


// ==========================================
// ❌ DELETE ADMIN
// ==========================================
router.delete(
  "/admin/:id",

  auth,

  adminOnly,

  async (req,res) => {
    try {

      const admin =
        await Admin.findByIdAndDelete(
          req.params.id
        );

      if (!admin) {
        return res.status(404).json({
          success: false,

          message:
            "Admin not found",
        });
      }

      res.status(200).json({
        success: true,

        message:
          "Admin deleted successfully",
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,

        message: "Server error",
      });
    }
  }
);

// ==========================================
// 🎓 ADD STUDENT
// ==========================================
router.post(
  "/students",

  auth,

  adminOnly,

  async (req,res) => {

    try {

      const {
        name,
        rollNumber,
        className,
        parentEmail,
      } = req.body;

      const student =
        await Student.create({
          name,
          rollNumber,
          className,
          parentEmail,
        });

      res.status(201).json({
        success: true,
        student,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

// ==========================================
// 🏫 ASSIGN CLASS TO TEACHER
// ==========================================
router.put(
  "/assign-class/:id",

  auth,

  adminOnly,

  async (req, res) => {

    try {

      const {
        assignedClass
      } = req.body;

      const teacher =
        await Teacher.findById(
          req.params.id
        );

      if (!teacher) {

        return res.status(404).json({

          success: false,

          message:
            "Teacher not found",
        });
      }

      teacher.assignedClass =
        assignedClass;

      await teacher.save();

      res.status(200).json({

        success: true,

        message:
          "Class assigned successfully",

        teacher,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({

        success: false,

        message:
          "Server error",
      });
    }
  }
);
// ==========================================
module.exports = router;