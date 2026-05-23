// ==========================================
// 📁 models/Class.js
// ==========================================

const mongoose =
  require("mongoose");


// ==========================================
// 🏫 CLASS SCHEMA
// ==========================================
const classSchema =
  new mongoose.Schema({

    // ======================================
    // 📚 CLASS NAME
    // ======================================
    className: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    // ======================================
    // 👤 CREATED BY
    // ======================================
    createdBy: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Teacher",

      default: null,
    },

  }, {

    timestamps: true,
  });


// ==========================================
// 📤 CLEAN RESPONSE
// ==========================================
classSchema.methods.toJSON =
  function () {

    const obj =
      this.toObject();

    return obj;
  };


// ==========================================
// 📤 EXPORT
// ==========================================
module.exports =
  mongoose.model(
    "Class",
    classSchema
  );