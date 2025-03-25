const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();


app.use(cors({
    origin: ['http://localhost:5173',],
    credentials: true
  }));

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// ✅ Import Routes from `routes/`
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const referralRoutes = require('./routes/referralRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// ✅ Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/appointments', appointmentRoutes);

module.exports = app;
