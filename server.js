const express = require('express');
const path = require('path');
const apiRouter = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust the Apache reverse proxy for correct client IP in rate limiting
app.set('trust proxy', 1);

// Parse JSON bodies (before API routes)
app.use(express.json({ limit: '2mb' }));

// Balanced cache control middleware
app.use((req, res, next) => {
    if (req.path.match(/\.html$/)) {
        res.set({ 'Cache-Control': 'public, max-age=3600' });
    } else if (req.path.match(/\.(css|js)$/)) {
        res.set({ 'Cache-Control': 'public, max-age=86400' });
    } else if (req.path.match(/manifest\.json$/)) {
        res.set({ 'Cache-Control': 'public, max-age=3600' });
    } else if (req.path.match(/\.(png|jpg|jpeg|gif|ico|svg)$/)) {
        res.set({ 'Cache-Control': 'public, max-age=31536000' });
    }
    next();
});

// API routes (before static files and catch-all)
app.use('/api', apiRouter);

// Block access to data directory (contains database and secrets)
app.use('/data', (req, res) => res.status(404).end());

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Daily Dozen Tracker server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});
