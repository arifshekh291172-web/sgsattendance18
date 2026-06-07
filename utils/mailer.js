// ==========================================
// 📧 MAILER CONFIG
// ==========================================

const nodemailer = require("nodemailer");

console.log("================================");
console.log("NEW MAILER FILE LOADED");
console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS LENGTH:",
  process.env.EMAIL_PASS
    ? process.env.EMAIL_PASS.length
    : 0
);
console.log("================================");

// ==========================================
// 🚀 GMAIL SMTP TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,

  requireTLS: true,
});

// ==========================================
// ✅ VERIFY SMTP
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
      <div style="font-family:Arial,sans-serif;padding:20px;background:#f4f7ff;">
        <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:12px;">

          <h2 style="color:#4f46e5;">
            Attendance Notification
          </h2>

          <p>Dear Parent,</p>

          <p>
            This is to inform you that
            <strong>${studentName}</strong>
            was marked
            <span style="color:red;font-weight:bold;">
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
      "✅ Email Sent Successfully"
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