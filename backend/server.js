const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection. Fail fast instead of hanging when the database is
// unreachable (for example, an Atlas IP allowlist that blocks the host).
mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Passcode lock. When APP_PASSCODE is set (on the hosted site), every API
// request must send it in the X-Passcode header. Unset locally, so dev stays open.
const passcodeMatches = (given) => {
    const expected = Buffer.from(process.env.APP_PASSCODE);
    const actual = Buffer.from(String(given ?? ''));
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
};

app.use('/api', (req, res, next) => {
    if (!process.env.APP_PASSCODE || passcodeMatches(req.get('x-passcode'))) return next();
    res.status(401).json({ message: 'Passcode required' });
});

// Routes
app.get('/', (req, res) => {
    res.send('HabitKit Clone API is running');
});

const habitRoutes = require('./routes/habits');
app.use('/api/habits', habitRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
