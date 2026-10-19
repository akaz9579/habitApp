const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('HabitKit Clone API is running');
});

// Import Routes (to be created)
const habitRoutes = require('./routes/habits');
app.use('/api/habits', habitRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
