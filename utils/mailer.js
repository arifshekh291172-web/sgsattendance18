// ==========================================
// 📧 MAILER CONFIG
// ==========================================

const nodemailer =
  require("nodemailer");


// ==========================================
// 🚀 TRANSPORTER
// ==========================================
const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });


// ==========================================
// ✅ VERIFY EMAIL SERVER
// ==========================================
transporter.verify(
  (err) => {

    if (err) {

      console.log(
        "❌ Email server error:",
        err
      );

    } else {

      console.log(
        "✅ Email server ready"
      );
    }
  }
);


// ==========================================
// 📩 SEND ABSENT MAIL
// ==========================================
const sendAbsentMail =
  async (
    parentEmail,
    studentName,
    date,
    className
  ) => {

    try {

      const mailOptions = {

        from:
          process.env.EMAIL_USER,

        to:
          parentEmail,

        subject:
          `Attendance Alert - ${studentName}`,

        html: `

          <div style="
            font-family: Arial;
            padding: 20px;
            background: #f4f7ff;
          ">

            <div style="
              max-width: 600px;
              margin: auto;
              background: white;
              padding: 30px;
              border-radius: 12px;
            ">

              <h2 style="
                color: #4f46e5;
              ">
                Attendance Notification
              </h2>

              <p>
                Dear Parent,
              </p>

              <p>
                This is to inform you that
                <strong>
                  ${studentName}
                </strong>
                was marked
                <span style="
                  color: red;
                  font-weight: bold;
                ">
                  ABSENT
                </span>
                on
                <strong>
                  ${date}
                </strong>.
              </p>

              <p>
                Class:
                <strong>
                  ${className}
                </strong>
              </p>

              <p>
                Please contact the school
                if needed.
              </p>

              <br>

              <p>
                Regards,
                <br>
                SGS Attendance System
              </p>

            </div>

          </div>
        `,
      };

      // ====================================
      // SEND MAIL
      // ====================================
      await transporter.sendMail(
        mailOptions
      );

      console.log(
        `📧 Absent email sent to ${parentEmail}`
      );

    } catch (err) {

      console.error(
        "❌ Mail Error:",
        err.message
      );
    }
  };


// ==========================================
module.exports = {
  sendAbsentMail,
};