// ==========================================
// 📁 routes/classRoutes.js
// ==========================================

const router =
  require("express").Router();

const auth =
  require("../middleware/auth");

const Class =
  require("../models/Class");


// ==========================================
// ➕ CREATE CLASS
// ==========================================
router.post(
  "/",

  auth,

  async (req, res) => {

    try {

      const {
        className
      } = req.body;

      // ====================================
      // VALIDATION
      // ====================================
      if (!className) {

        return res.status(400).json({
          success: false,
          message:
            "Class name required",
        });
      }

      // ====================================
      // CHECK EXISTING
      // ====================================
      const exists =
        await Class.findOne({
          className:
            className.toUpperCase(),
        });

      if (exists) {

        return res.status(400).json({
          success: false,
          message:
            "Class already exists",
        });
      }

      // ====================================
      // CREATE CLASS
      // ====================================
      const newClass =
        await Class.create({

          className:
            className.toUpperCase(),

          createdBy:
            req.user.id,
        });

      // ====================================
      // RESPONSE
      // ====================================
      res.status(201).json({

        success: true,

        message:
          "Class created successfully",

        class:
          newClass,
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
// 📚 GET ALL CLASSES
// ==========================================
router.get(
  "/",

  auth,

  async (req, res) => {

    try {

      const classes =
        await Class.find()
          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        classes,
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
// 🔍 GET SINGLE CLASS
// ==========================================
router.get(
  "/:id",

  auth,

  async (req, res) => {

    try {

      const classData =
        await Class.findById(
          req.params.id
        );

      if (!classData) {

        return res.status(404).json({

          success: false,

          message:
            "Class not found",
        });
      }

      res.status(200).json({

        success: true,

        class:
          classData,
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
// ✏️ UPDATE CLASS
// ==========================================
router.put(
  "/:id",

  auth,

  async (req, res) => {

    try {

      const {
        className
      } = req.body;

      const updatedClass =
        await Class.findByIdAndUpdate(

          req.params.id,

          {
            className:
              className.toUpperCase(),
          },

          {
            new: true,
          }
        );

      if (!updatedClass) {

        return res.status(404).json({

          success: false,

          message:
            "Class not found",
        });
      }

      res.status(200).json({

        success: true,

        message:
          "Class updated",

        class:
          updatedClass,
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
// ❌ DELETE CLASS
// ==========================================
router.delete(
  "/:id",

  auth,

  async (req, res) => {

    try {

      const deletedClass =
        await Class.findByIdAndDelete(
          req.params.id
        );

      if (!deletedClass) {

        return res.status(404).json({

          success: false,

          message:
            "Class not found",
        });
      }

      res.status(200).json({

        success: true,

        message:
          "Class deleted successfully",
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
module.exports =
  router;