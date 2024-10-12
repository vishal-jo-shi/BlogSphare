const express = require('express');
require('dotenv').config();
const app = express();

// Middleware for CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL); // Removed extra space
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optional: Uncomment if you plan to use local uploads
// app.use('/images', express.static('uploads'));

app.get('/', async (req, res) => {
    res.send("Hello World");
});

// Use your defined routes
app.use('/api', require("./Routes/CreateUser"));
app.use('/api', require("./Routes/DisplayBlogs"));
app.use('/api', require("./Routes/DisplayComment"));
app.use('/api', require("./Routes/DisplayProfiles"));
app.use('/api', require("./middleware/uploads"));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});
