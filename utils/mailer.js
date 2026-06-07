// ==========================================
// 📧 utils/mailer.js
// ==========================================

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
// 🚀 GMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
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
        ">

          <h2 style="color:#4f46e5;">
            Attendance Notification
          </h2>

          <p>Dear Parent,</p>

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
      "❌ FULL MAIL ERROR:"
    );

    console.error(err);

    return false;
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  sendAbsentMail,
};
