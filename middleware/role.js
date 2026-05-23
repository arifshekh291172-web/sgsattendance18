// ===============================
// 🔐 ROLE MIDDLEWARE (PRODUCTION)
// ===============================

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // ===============================
      // ❌ USER NOT FOUND
      // ===============================
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - No user data"
        });
      }

      const userRole = req.user.role;

      // ===============================
      // 🔁 SINGLE ROLE → ARRAY CONVERT
      // ===============================
      if (typeof allowedRoles === "string") {
        allowedRoles = [allowedRoles];
      }

      // ===============================
      // ❌ ROLE NOT ALLOWED
      // ===============================
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied for role: ${userRole}`
        });
      }

      // ===============================
      // ✅ ACCESS GRANTED
      // ===============================
      next();

    } catch (err) {
      console.error("ROLE MIDDLEWARE ERROR:", err);

      res.status(500).json({
        success: false,
        message: "Role check failed"
      });
    }
  };
};