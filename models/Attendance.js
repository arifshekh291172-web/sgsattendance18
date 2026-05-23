const mongoose =
  require("mongoose");


/* ==========================================
   🎓 ATTENDANCE SCHEMA
========================================== */
const attendanceSchema =
  new mongoose.Schema(

    {

      /* CLASS */
      className: {

        type:String,

        required:true,

        uppercase:true,

        trim:true
      },

      /* TEACHER */
      teacherId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:"Teacher",

        required:true
      },

      /* DATE */
      date: {

        type:String,

        required:true
      },

      /* STUDENTS */
      students:[

        {

          /* STUDENT ID */
          studentId: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref:"Student",

            required:true
          },

          /* NAME */
          name: {

            type:String,

            required:true
          },

          /* ROLL NUMBER */
          rollNumber: {

            type:String,

            required:true
          },

          /* STATUS */
          status: {

            type:String,

            enum:[
              "Present",
              "Absent"
            ],

            required:true
          }
        }
      ]

    },

    {

      timestamps:true
    }
  );


/* ==========================================
   🚫 ONE RECORD PER CLASS PER DAY
========================================== */
attendanceSchema.index(

  {

    className:1,

    date:1
  },

  {

    unique:true
  }
);


/* ==========================================
   📊 SUMMARY METHOD
========================================== */
attendanceSchema.methods.getSummary =
  function () {

    const present =
      this.students.filter(

        student =>
          student.status ===
          "Present"

      ).length;

    const absent =
      this.students.length -
      present;

    return {

      total:
        this.students.length,

      present,

      absent,

      percentage:
        this.students.length

          ? Math.round(

              (
                present /

                this.students.length
              ) * 100
            )

          : 0
    };
  };


/* ==========================================
   🔍 GET BY TEACHER
========================================== */
attendanceSchema.statics.getByTeacher =
  function (teacherId) {

    return this.find({

      teacherId
    });
  };


/* ==========================================
   🔍 GET BY CLASS
========================================== */
attendanceSchema.statics.getByClass =
  function (className) {

    return this.find({

      className
    });
  };


/* ==========================================
   🚀 EXPORT
========================================== */
module.exports =
  mongoose.model(

    "Attendance",

    attendanceSchema
  );