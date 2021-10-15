// Built-in and external imports
const express = require('express');
const winston = require('winston');
require('dotenv').config();

// Local imports
const error = require('./middlewares/error');

// Init express app
const app = express();

// Middlewares
app.use(express.json());

// Import app modules
require('./utils/logging')();
require('./db/db')();


// Async Errors handler 
app.use(error);








const port = process.env.PORT || 5000;
app.listen(port, () => winston.info(`App run on port ${port}`));