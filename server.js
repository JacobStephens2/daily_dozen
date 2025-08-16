const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Balanced cache control middleware
app.use((req, res, next) => {
    // Cache HTML files for 1 hour
    if (req.path.match(/\.html$/)) {
        res.set({
            'Cache-Control': 'public, max-age=3600'
        });
    }
    // Cache CSS and JS files for 1 day
    else if (req.path.match(/\.(css|js)$/)) {
        res.set({
            'Cache-Control': 'public, max-age=86400'
        });
    }
    // Cache manifest file for 1 hour
    else if (req.path.match(/manifest\.json$/)) {
        res.set({
            'Cache-Control': 'public, max-age=3600'
        });
    }
    // Cache images for 1 year
    else if (req.path.match(/\.(png|jpg|jpeg|gif|ico|svg)$/)) {
        res.set({
            'Cache-Control': 'public, max-age=31536000'
        });
    }
    next();
});

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
