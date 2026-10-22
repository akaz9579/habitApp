const mongoose = require('mongoose');

let connecting = null;

// Connect on demand and retry after a failure. On Vercel each new instance
// starts cold, so a connection attempt that fails once must not leave the
// instance stuck: the next request tries again.
function connectDb() {
    const state = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting
    if (state === 1) return Promise.resolve();
    if (state === 2 && connecting) return connecting;

    connecting = mongoose
        .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
        .then(() => {
            console.log('MongoDB Connected');
        })
        .catch((err) => {
            connecting = null;
            throw err;
        });
    return connecting;
}

module.exports = { connectDb };
