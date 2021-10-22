// Built-in and external imports
const express = require('express');
const winston = require('winston');
const helmet = require('helmet');
const compression = require('compression');

//Dotenv module configuration
require('dotenv').config();

// Local files imports
const error = require('./middlewares/error');
const users = require('./routes/users');
const auth = require('./routes/auth');
const customers = require('./routes/customers');
const teams = require('./routes/teams');
const tickets = require('./routes/tickets');

// Init express app
const app = express();



// Middlewares
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Import app modules
require('./helpers/logging')();
require('./db/db')();
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/customers', customers);
app.use('/api/teams', teams);
app.use('/api/tickets', tickets)
app.use(helmet());
app.use(compression());

// Async Errors handler 
app.use(error);


// Connexion PORT
const port = process.env.PORT || 5000;
app.listen(port, () => winston.info(`App run on port ${port}`));