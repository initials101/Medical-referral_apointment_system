const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors({
  origin: ['http://localhost:5173',],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "doctorION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// import routes
const auth = require("./controller/auth");
const appointment = require("./controller/appointment");
const doctor = require("./controller/doctor");
const hospital = require("./controller/hospital");
const patient = require("./controller/patient");
const referral = require("./controller/referral");

app.use("/api/auth", auth);
app.use("/api/referral", referral);
app.use("/api/appointment", appointment);
app.use("/api/doctor", doctor);
app.use("/api/hospital", hospital);
app.use("/api/patient", patient);

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;