// routes/authRoutes.js

const router =
  require("express").Router();

const jwt =
  require("jsonwebtoken");

const bcrypt =
  require("bcryptjs");

const Teacher =
  require("../models/Teacher");

const Admin =
  require("../models/Admin");


// ==========================================
// 🔐 GENERATE JWT TOKEN
// ==========================================
const generateToken = (user) => {

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );
};


// ==========================================
// 🧑‍🏫 REGISTER USER
// ==========================================
router.post(
  "/register",

  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
        role,
        assignedClass,
      } = req.body;

      // ====================================
      // VALIDATION
      // ====================================
      if (
        !name ||
        !email ||
        !password
      ) {

        return res.status(400).json({
          message:
            "All fields are required",
        });
      }

      // ====================================
      // CHECK EXISTING USER
      // ====================================
      const teacherExists =
        await Teacher.findOne({
          email,
        });

      const adminExists =
        await Admin.findOne({
          email,
        });

      if (
        teacherExists ||
        adminExists
      ) {

        return res.status(400).json({
          message:
            "User already exists",
        });
      }

      // ====================================
      // CREATE ADMIN
      // ====================================
      if (role === "admin") {

        // 🔐 HASH ADMIN PASSWORD
        const hashedPassword =
          await bcrypt.hash(
            password,
            10
          );

        const admin =
          new Admin({
            name,
            email,
            password:
              hashedPassword,
            role: "admin",
          });

        await admin.save();

        return res.status(201).json({
          message:
            "Admin registered successfully",
        });
      }

      // ====================================
      // CREATE TEACHER
      // ====================================
      // ⚠️ DO NOT HASH HERE
      // Teacher model already hashes password
      const teacher =
        new Teacher({
          name,
          email,
          password,
          role: "teacher",
          assignedClass:
            assignedClass || null,
        });

      await teacher.save();

      res.status(201).json({
        message:
          "Teacher registered successfully",
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
// 🔐 LOGIN
// ==========================================
router.post(
  "/login",

  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      // ====================================
      // VALIDATION
      // ====================================
      if (
        !email ||
        !password
      ) {

        return res.status(400).json({
          message:
            "Email and password required",
        });
      }

      // ====================================
      // CHECK ADMIN
      // ====================================
      let user =
        await Admin.findOne({
          email,
        });

      // ====================================
      // CHECK TEACHER
      // ====================================
      if (!user) {

        user =
          await Teacher.findOne({
            email,
          });
      }

      // ====================================
      // USER NOT FOUND
      // ====================================
      if (!user) {

        return res.status(404).json({
          message:
            "User not found",
        });
      }

      // ====================================
      // PASSWORD CHECK
      // ====================================
      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(401).json({
          message:
            "Invalid password",
        });
      }

      // ====================================
      // GENERATE TOKEN
      // ====================================
      const token =
        generateToken(user);

      // ====================================
      // SUCCESS RESPONSE
      // ====================================
      res.status(200).json({

        message:
          "Login successful",

        token,

        user: {
          id: user._id,

          name: user.name,

          email: user.email,

          role: user.role,

          assignedClass:
            user.assignedClass || null,
        },
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
// 👤 GET CURRENT USER
// ==========================================
router.get(
  "/me",

  async (req, res) => {

    try {

      const authHeader =
        req.headers.authorization;

      if (!authHeader) {

        return res.status(401).json({
          message:
            "No token provided",
        });
      }

      const token =
        authHeader.split(" ")[1];

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      let user =
        await Admin.findById(
          decoded.id
        );

      if (!user) {

        user =
          await Teacher.findById(
            decoded.id
          );
      }

      if (!user) {

        return res.status(404).json({
          message:
            "User not found",
        });
      }

      res.status(200).json({
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        assignedClass:
          user.assignedClass || null,
      });

    } catch (err) {

      console.error(err);

      res.status(401).json({
        message:
          "Invalid token",
      });
    }
  }
);


// ==========================================
// 🔑 CHANGE PASSWORD
// ==========================================
router.put(
  "/change-password",

  async (req, res) => {

    try {

      const authHeader =
        req.headers.authorization;

      if (!authHeader) {

        return res.status(401).json({
          message:
            "No token provided",
        });
      }

      const token =
        authHeader.split(" ")[1];

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      const {
        oldPassword,
        newPassword,
      } = req.body;

      let user =
        await Admin.findById(
          decoded.id
        );

      if (!user) {

        user =
          await Teacher.findById(
            decoded.id
          );
      }

      if (!user) {

        return res.status(404).json({
          message:
            "User not found",
        });
      }

      // ====================================
      // CHECK OLD PASSWORD
      // ====================================
      const isMatch =
        await bcrypt.compare(
          oldPassword,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          message:
            "Wrong old password",
        });
      }

      // ====================================
      // HASH NEW PASSWORD
      // ====================================
      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      res.status(200).json({
        message:
          "Password updated successfully",
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
module.exports = router;