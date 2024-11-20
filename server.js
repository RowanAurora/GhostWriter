const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'your-secret-key', // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to save user input
app.post('/save', (req, res) => {
    const userInput = req.body.text;

    // Store input in session
    req.session.text = userInput;
    res.json({ message: 'Text saved', text: req.session.text });
});

// API endpoint to retrieve user input
app.get('/retrieve', (req, res) => {
    const text = req.session.text || '';
    res.json({ text });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
