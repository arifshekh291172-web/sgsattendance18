// ==========================================
// 📧 utils/mailer.js
// SGS Attendance - Brevo API Version
// ==========================================

const axios = require("axios");

// ==========================================
// 📩 SEND ABSENT MAIL
// ==========================================

const sendAbsentMail = async (
  parentEmail,
  studentName,
  date,
  className
) => {
  try {

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "SGS Attendance System",
          email: "arifshekh291172@gmail.com"
        },

        to: [
          {
            email: parentEmail
          }
        ],

        subject: `🚨 Attendance Alert | ${studentName} Marked Absent`,

        htmlContent: `
        <div style="
          max-width:700px;
          margin:auto;
          font-family:Arial,sans-serif;
          background:#f5f7fb;
          padding:30px;
        ">

          <div style="
            background:#ffffff;
            border-radius:15px;
            overflow:hidden;
            box-shadow:0 4px 20px rgba(0,0,0,0.08);
          ">

            <div style="
              background:linear-gradient(135deg,#2563eb,#4f46e5);
              padding:25px;
              text-align:center;
              color:white;
            ">
              <h1>🏫 SGS Attendance Management System</h1>
              <p>Student Attendance Notification</p>
            </div>

            <div style="padding:30px;">

              <p>Dear Parent,</p>

              <p>
                This is to inform you that your child has been marked absent.
              </p>

              <div style="
                background:#fff4f4;
                border-left:5px solid #ef4444;
                padding:18px;
                border-radius:8px;
              ">

                <p>
                  <b>Student Name:</b>
                  ${studentName}
                </p>

                <p>
                  <b>Class:</b>
                  ${className}
                </p>

                <p>
                  <b>Date:</b>
                  ${date}
                </p>

                <p>
                  <b>Status:</b>
                  <span style="
                    color:red;
                    font-weight:bold;
                  ">
                    ABSENT
                  </span>
                </p>

              </div>

              <br>

              <p>
                Kindly contact the school if
                this information appears incorrect.
              </p>

              <p>
                Regards,<br>
                SGS Attendance Management System
              </p>

            </div>

          </div>

        </div>
        `
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Email Sent Successfully");
    console.log(response.data);

    return true;

  } catch (error) {

    console.error(
      "❌ Email Error:",
      error.response?.data || error.message
    );

    return false;
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  sendAbsentMail
};