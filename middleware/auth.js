// ==========================================
// 📁 middleware/auth.js
// FULLY FIXED FINAL VERSION
// ==========================================

const jwt =
  require("jsonwebtoken");


// ==========================================
// 🔐 AUTH MIDDLEWARE
// ==========================================
const auth =
  async (
    req,
    res,
    next
  ) => {

    try {

      // ====================================
      // 📌 GET AUTH HEADER
      // ====================================
      const authHeader =
        req.headers.authorization;

      // ====================================
      // ❌ NO HEADER
      // ====================================
      if (
        !authHeader ||
        !authHeader.startsWith(
          "Bearer "
        )
      ) {

        return res.status(401).json({

          success: false,

          message:
            "No token provided",
        });
      }

      // ====================================
      // 🔑 EXTRACT TOKEN
      // ====================================
      const token =
        authHeader.split(
          " "
        )[1];

      // ====================================
      // ❌ TOKEN MISSING
      // ====================================
      if (!token) {

        return res.status(401).json({

          success: false,

          message:
            "Token missing",
        });
      }

      // ====================================
      // 🔍 VERIFY TOKEN
      // ====================================
      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      // ====================================
      // 👤 ATTACH USER
      // ====================================
      req.user = {

        id:
          decoded.id ||
          decoded._id,

        role:
          decoded.role,
      };

      // ====================================
      // ❌ INVALID USER
      // ====================================
      if (
        !req.user.id
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid token payload",
        });
      }

      // ====================================
      // ✅ NEXT
      // ====================================
      next();

    } catch (err) {

      console.error(
        "🔴 AUTH ERROR:",
        err.message
      );

      // ====================================
      // ⌛ TOKEN EXPIRED
      // ====================================
      if (
        err.name ===
        "TokenExpiredError"
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Token expired",
        });
      }

      // ====================================
      // ❌ INVALID TOKEN
      // ====================================
      if (
        err.name ===
        "JsonWebTokenError"
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid token",
        });
      }

      // ====================================
      // ❌ AUTH FAILED
      // ====================================
      return res.status(401).json({

        success: false,

        message:
          "Authentication failed",
      });
    }
  };


// ==========================================
// 👑 ADMIN ONLY
// ==========================================
const adminOnly =
  (
    req,
    res,
    next
  ) => {

    try {

      // ====================================
      // ❌ NO USER
      // ====================================
      if (
        !req.user
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Unauthorized",
        });
      }

      // ====================================
      // ❌ NOT ADMIN
      // ====================================
      if (
        req.user.role !==
        "admin"
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Admin only access",
        });
      }

      // ====================================
      // ✅ NEXT
      // ====================================
      next();

    } catch (err) {

      console.error(
        "ADMIN AUTH ERROR:",
        err.message
      );

      return res.status(500).json({

        success: false,

        message:
          "Authorization failed",
      });
    }
  };


// ==========================================
// 👨‍🏫 TEACHER ONLY
// ==========================================
const teacherOnly =
  (
    req,
    res,
    next
  ) => {

    try {

      // ====================================
      // ❌ NO USER
      // ====================================
      if (
        !req.user
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Unauthorized",
        });
      }

      // ====================================
      // ❌ NOT TEACHER
      // ====================================
      if (
        req.user.role !==
        "teacher"
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Teacher only access",
        });
      }

      // ====================================
      // ✅ NEXT
      // ====================================
      next();

    } catch (err) {

      console.error(
        "TEACHER AUTH ERROR:",
        err.message
      );

      return res.status(500).json({

        success: false,

        message:
          "Authorization failed",
      });
    }
  };


// ==========================================
// 📤 EXPORTS
// ==========================================
module.exports =
  auth;

module.exports.adminOnly =
  adminOnly;

module.exports.teacherOnly =
  teacherOnly;