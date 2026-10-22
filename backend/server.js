const crypto = require('crypto');
const express = require('express');
const { connectDb } = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Start connecting right away so the first request is faster. Requests also
// wait for (and if needed retry) the connection below.
connectDb().catch((err) => console.error('MongoDB connection error:', err.message));

// Health check, open without the passcode. Reports only whether the
// database is reachable, so cold starts can be diagnosed from anywhere.
app.get('/api/health', async (req, res) => {
    try {
        await connectDb();
        res.json({ ok: true, db: 'connected' });
    } catch (err) {
        res.status(503).json({ ok: false, db: 'unreachable', error: err.name });
    }
});

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

// Make sure the database is connected before any data route runs.
app.use('/api', async (req, res, next) => {
    try {
        await connectDb();
        next();
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        res.status(503).json({ message: 'Database unavailable. Try again in a moment.' });
    }
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
