// ==========================================
// 📧 utils/mailer.js
// ==========================================
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS ? "PASS FOUND" : "PASS NOT FOUND");
const nodemailer = require("nodemailer");

console.log("================================");
console.log("📧 MAILER LOADED");
console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL PASS EXISTS:",
  !!process.env.EMAIL_PASS
);
console.log("================================");

// ==========================================
// 🚀 GMAIL SMTP TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
});

// ==========================================
// ✅ VERIFY CONNECTION
// ==========================================

transporter.verify((err) => {
  if (err) {
    console.error(
      "❌ Email server error:",
      err
    );
  } else {
    console.log(
      "✅ Email server ready"
    );
  }
});

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

    const mailOptions = {

      from: `"SGS Attendance System" <${process.env.EMAIL_USER}>`,

      to: parentEmail,

      subject: `Attendance Alert - ${studentName}`,

      html: `
      <div style="
        font-family: Arial, sans-serif;
        background:#f4f7ff;
        padding:20px;
      ">

        <div style="
          max-width:600px;
          margin:auto;
          background:white;
          padding:30px;
          border-radius:12px;
          box-shadow:0 2px 10px rgba(0,0,0,0.1);
        ">

          <h2 style="
            color:#4f46e5;
            margin-bottom:20px;
          ">
            Attendance Notification
          </h2>

          <p>
            Dear Parent,
          </p>

          <p>
            This is to inform you that
            <strong>${studentName}</strong>
            was marked
            <span style="
              color:red;
              font-weight:bold;
            ">
              ABSENT
            </span>
            on
            <strong>${date}</strong>.
          </p>

          <p>
            Class:
            <strong>${className}</strong>
          </p>

          <p>
            Please contact the school if needed.
          </p>

          <br>

          <p>
            Regards,<br>
            SGS Attendance System
          </p>

        </div>

      </div>
      `,
    };

    const info =
      await transporter.sendMail(
        mailOptions
      );

    console.log(
      `📧 Email sent to ${parentEmail}`
    );

    console.log(
      "📨 Message ID:",
      info.messageId
    );

    return true;

  } catch (err) {

    console.error(
      "❌ Mail Error:",
      err
    );

    return false;
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  sendAbsentMail,
};
