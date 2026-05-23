// ==========================================
// 📁 routes/teacherRoutes.js
// FULLY FIXED FINAL VERSION
// ==========================================

const router =
  require("express").Router();


// ==========================================
// 🔐 AUTH
// ==========================================
const auth =
  require("../middleware/auth");

const {
  teacherOnly,
} = require("../middleware/auth");


// ==========================================
// 📦 MODELS
// ==========================================
const Teacher =
  require("../models/Teacher");

const Student =
  require("../models/Student");

const Attendance =
  require("../models/Attendance");


// ==========================================
// 📧 MAILER
// ==========================================
const {
  sendAbsentMail,
} = require("../utils/mailer");


// ==========================================
// 📊 TEACHER DASHBOARD
// ==========================================
router.get(
  "/dashboard",

  auth,

  teacherOnly,

  async (
    req,
    res
  ) => {

    try {

      const teacher =
        await Teacher.findById(
          req.user.id
        ).select(
          "-password"
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
// 🎓 GET STUDENTS
// ==========================================
router.get(
  "/students",

  auth,

  teacherOnly,

  async (
    req,
    res
  ) => {

    try {

      const teacher =
        await Teacher.findById(
          req.user.id
        );

      if (!teacher) {

        return res.status(404).json({

          success: false,

          message:
            "Teacher not found",
        });
      }

      if (
        !teacher.assignedClass
      ) {

        return res.status(400).json({

          success: false,

          message:
            "No class assigned",
        });
      }

      console.log(
        "Teacher Class:",
        teacher.assignedClass
      );

      const students =
        await Student.find({

          className: {
            $regex:
              `^${teacher.assignedClass.trim()}$`,

            $options: "i",
          },
        });

      console.log(
        "Students Found:",
        students.length
      );

      res.status(200).json({

        success: true,

        students,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({

        success: false,

        message:
          "Failed to load students",
      });
    }
  }
);


// ==========================================
// 📌 MARK ATTENDANCE
// ==========================================
router.post(
  "/attendance",

  auth,

  teacherOnly,

  async (
    req,
    res
  ) => {

    try {

      // ====================================
      // GET TEACHER
      // ====================================
      const teacher =
        await Teacher.findById(
          req.user.id
        );

      if (!teacher) {

        return res.status(404).json({

          success: false,

          message:
            "Teacher not found",
        });
      }

      // ====================================
      // NO CLASS
      // ====================================
      if (
        !teacher.assignedClass
      ) {

        return res.status(400).json({

          success: false,

          message:
            "No class assigned",
        });
      }

      const {
        date,
        students,
      } = req.body;

      // ====================================
      // VALIDATION
      // ====================================
      if (
        !date ||
        !students ||
        !students.length
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Attendance data missing",
        });
      }

      // ====================================
      // DUPLICATE CHECK
      // ====================================
      const existing =
        await Attendance.findOne({

          className:
            teacher.assignedClass,

          date,
        });

      if (existing) {

        return res.status(400).json({

          success: false,

          message:
            "Attendance already marked",
        });
      }

      // ====================================
      // FORMAT STUDENTS
      // ====================================
      const formattedStudents =
        [];

      for (const s of students) {

        const studentData =
          await Student.findById(
            s.studentId
          );

        if (!studentData) {
          continue;
        }

        formattedStudents.push({

          studentId:
            studentData._id,

          name:
            studentData.name,

          rollNumber:
            studentData.rollNumber,

          status:
            s.status
        });
      }

      // ====================================
      // CREATE ATTENDANCE
      // ====================================
      const attendance =
        new Attendance({

          className:
            teacher.assignedClass,

          teacherId:
            teacher._id,

          date,

          students:
            formattedStudents
        });

      await attendance.save();

      // ====================================
      // SEND ABSENT EMAIL
      // ====================================
      for (const s of formattedStudents) {

        if (
          s.status ===
          "Absent"
        ) {

          const student =
            await Student.findById(
              s.studentId
            );

          if (
            student &&
            student.parentEmail
          ) {

            await sendAbsentMail(

              student.parentEmail,

              student.name,

              date,

              teacher.assignedClass
            );
          }
        }
      }

      // ====================================
      // SUCCESS
      // ====================================
      res.status(201).json({

        success: true,

        message:
          "Attendance marked successfully",
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({

        success: false,

        message:
          "Failed to mark attendance",
      });
    }
  }
);


// ==========================================
// 📚 ATTENDANCE RECORDS
// ==========================================
router.get(
  "/records",

  auth,

  teacherOnly,

  async (
    req,
    res
  ) => {

    try {

      const records =
        await Attendance.find({

          teacherId:
            req.user.id,
        })

          .populate(
            "students.studentId",
            "name rollNumber"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        records,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({

        success: false,

        message:
          "Failed to load records",
      });
    }
  }
);


// ==========================================
// 👤 TEACHER PROFILE
// ==========================================
router.get(
  "/profile",

  auth,

  teacherOnly,

  async (
    req,
    res
  ) => {

    try {

      const teacher =
        await Teacher.findById(
          req.user.id
        ).select(
          "-password"
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
// 📚 GET MY RECORDS
// ==========================================
router.get(
  "/my-records",

  auth,

  async (req,res) => {

    try {

      const teacherId =
        req.user.id;

      const teacher =
        await Teacher.findById(
          teacherId
        );

      if (!teacher) {

        return res.status(404).json({

          success:false,

          message:
            "Teacher not found"
        });
      }

      const records =
        await Attendance.find({

          className:
            teacher.assignedClass
        })

        .sort({
          date:-1
        });

      const finalRecords =
        [];

      records.forEach(
        (record) => {

          record.students.forEach(
            (student) => {

              finalRecords.push({

                date:
                  record.date,

                rollNumber:
                  student.rollNumber,

                studentName:
                  student.name,

                status:
                  student.status
              });
            }
          );
        }
      );

      res.status(200).json({

        success:true,

        records:
          finalRecords
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success:false,

        message:
          "Server error"
      });
    }
  }
);


// ==========================================
module.exports =
  router;