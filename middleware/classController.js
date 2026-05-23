/**
 * classController.js
 * Full CRUD operations for Class management.
 * Only admins can create / update / delete.
 * Teachers (and admins) can view.
 */

const Class = require("../models/Class");

/* ──────────────────────────────────────────────
   POST /api/classes
   Create a new class (admin only)
────────────────────────────────────────────── */
exports.createClass = async (req, res) => {
  try {
    const { className, section } = req.body;

    if (!className || !section) {
      return res
        .status(400)
        .json({ success: false, message: "Class name and section are required." });
    }

    // Prevent duplicates
    const existing = await Class.findOne({
      className: className.trim(),
      section: section.trim().toUpperCase(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Class ${className.trim()}-${section.trim().toUpperCase()} already exists.`,
      });
    }

    const newClass = await Class.create({
      className: className.trim(),
      section: section.trim().toUpperCase(),
      createdBy: req.user._id, // set by auth middleware
    });

    return res.status(201).json({
      success: true,
      message: `Class ${newClass.displayName} created successfully.`,
      data: newClass,
    });
  } catch (error) {
    console.error("createClass error:", error);
    // Handle Mongoose duplicate-key error
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "This class-section combination already exists." });
    }
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

/* ──────────────────────────────────────────────
   GET /api/classes
   Fetch all classes (admin + teacher)
────────────────────────────────────────────── */
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .sort({ className: 1, section: 1 })
      .populate("createdBy", "name email");

    return res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    console.error("getAllClasses error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

/* ──────────────────────────────────────────────
   GET /api/classes/:id
   Get single class by ID
────────────────────────────────────────────── */
exports.getClassById = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id).populate("createdBy", "name email");

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found." });
    }

    return res.status(200).json({ success: true, data: cls });
  } catch (error) {
    console.error("getClassById error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

/* ──────────────────────────────────────────────
   PUT /api/classes/:id
   Update a class (admin only)
────────────────────────────────────────────── */
exports.updateClass = async (req, res) => {
  try {
    const { className, section } = req.body;

    const cls = await Class.findById(req.params.id);
    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found." });
    }

    // Check for duplicate if name/section is changing
    if (className || section) {
      const newName = className ? className.trim() : cls.className;
      const newSection = section ? section.trim().toUpperCase() : cls.section;

      const duplicate = await Class.findOne({
        className: newName,
        section: newSection,
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Class ${newName}-${newSection} already exists.`,
        });
      }

      cls.className = newName;
      cls.section = newSection;
    }

    await cls.save();

    return res.status(200).json({
      success: true,
      message: `Class updated to ${cls.displayName}.`,
      data: cls,
    });
  } catch (error) {
    console.error("updateClass error:", error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "This class-section combination already exists." });
    }
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

/* ──────────────────────────────────────────────
   DELETE /api/classes/:id
   Delete a class (admin only)
────────────────────────────────────────────── */
exports.deleteClass = async (req, res) => {
  try {
    const cls = await Class.findByIdAndDelete(req.params.id);

    if (!cls) {
      return res.status(404).json({ success: false, message: "Class not found." });
    }

    return res.status(200).json({
      success: true,
      message: `Class ${cls.displayName} deleted successfully.`,
    });
  } catch (error) {
    console.error("deleteClass error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
