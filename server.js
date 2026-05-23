// ===============================
// 🚀 SAMS SERVER (FINAL FIXED)
// FILE: server.js
// ===============================

require("dotenv").config();

const express =
  require("express");

const mongoose =
  require("mongoose");

const cors =
  require("cors");

const path =
  require("path");

const app =
  express();


// ===============================
// 🔐 MIDDLEWARE
// ===============================
app.use(cors());

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true
  })
);


// ===============================
// 📁 STATIC FRONTEND
// ===============================
app.use(
  express.static(__dirname)
);


// ===============================
// 🗄️ MONGODB CONNECTION
// ===============================
mongoose.connect(
  process.env.MONGO_URI
)

.then(() => {

  console.log(
    "✅ MongoDB Connected"
  );
})

.catch((err) => {

  console.error(
    "❌ MongoDB Error:",
    err.message
  );

  process.exit(1);
});


// ===============================
// 📡 API ROUTES
// ===============================

// 🔐 AUTH
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);


// 👨‍💼 ADMIN
app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);


// 👨‍🏫 TEACHER
app.use(
  "/api/teacher",
  require("./routes/teacherRoutes")
);


// 🏫 CLASSES
app.use(
  "/api/classes",
  require("./routes/classRoutes")
);


// ===============================
// 🧪 HEALTH CHECK
// ===============================
app.get(
  "/api/health",

  (req, res) => {

    res.json({

      success: true,

      status: "OK",

      message:
        "Server running 🚀",
    });
  }
);


// ===============================
// 🌐 FRONTEND ROUTES
// ===============================

// ADMIN LOGIN
app.get(
  "/admin-login",

  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "admin-login.html"
      )
    );
  }
);


// TEACHER LOGIN
app.get(
  "/teacher-login",

  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "teacher-login.html"
      )
    );
  }
);


// ADMIN DASHBOARD
app.get(
  "/admin-dashboard",

  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "admin-dashboard.html"
      )
    );
  }
);


// TEACHER DASHBOARD
app.get(
  "/teacher-dashboard",

  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "teacher-dashboard.html"
      )
    );
  }
);


// ===============================
// ❌ 404 ROUTE HANDLER
// ===============================
app.use(
  (req, res) => {

    res.status(404).json({

      success: false,

      message:
        "Route not found",
    });
  }
);


// ===============================
// ⚠️ GLOBAL ERROR HANDLER
// ===============================
app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.error(
      "🔥 SERVER ERROR:",
      err.stack
    );

    res.status(
      err.status || 500
    )

    .json({

      success: false,

      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SGS Attendance API Running Successfully"
  });
});
// ===============================
// 🚀 START SERVER
// ===============================
const PORT =
  process.env.PORT ||
  5000;

app.listen(
  PORT,

  () => {

    console.log(`
🚀 SERVER RUNNING
🌐 URL:
http://localhost:${PORT}
    `);
  }
);