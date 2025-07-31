require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

// 🛡️ Security Middleware
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const corsMiddleware = require("./config/corsOptions");
const { logger } = require("./middleware/logger");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const connectDB = require("./config/dbConn");
const setupSocket = require("./middleware/onlineStatus");
const auditLogger = require("./middleware/auditLogger");
const passportSetup = require("./config/passportSetup");
const requireAuth = require("./middleware/requireAuth");
const url = require("./config/url");

const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: url, methods: ["GET", "POST"] },
});

// 🔌 DB & Passport
connectDB();
passportSetup();

// 🧱 Standard Middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Apply security sanitizers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

app.use(cookieParser());

// 🔐 Session & Passport
app.use(
  session({
    secret: process.env.SESSION_TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production" || false,
      sameSite: "Lax",
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());

// 🔐 Public Routes
app.use("/api/auth", require("./routes/auth"));

// 🔐 Protected Routes
app.use(requireAuth);
app.use(auditLogger);
setupSocket(io);

app.use("/api/audit-logs", require("./routes/audit"));
app.use("/api/users", require("./routes/user"));
app.use("/api/tasks", require("./routes/task"));
app.use("/api/notes", require("./routes/note"));
app.use("/api/sleeps", require("./routes/sleep"));

// 🌐 Final Middleware
app.use(notFound);
app.use(errorHandler);

// 🟢 DB Ready → Start Server
mongoose.connection.once("open", () => {
  console.log("Database Connected Successfully!");
  server.listen(port, () => console.log(`Server running on port ${port}`));
});
