// Built-in and external imports
const express = require('express');
const winston = require('winston');
require('dotenv').config();

// Local imports
const error = require('./middlewares/error');
const users = require('./routes/users');
const auth = require('./routes/auth');
// Init express app
const app = express();



// Middlewares
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Import app modules
require('./utils/logging')();
require('./db/db')();
app.use('/api/users', users);
app.use('/api/auth', auth);

// Async Errors handler 
app.use(error);








const port = process.env.PORT || 5000;
app.listen(port, () => winston.info(`App run on port ${port}`));