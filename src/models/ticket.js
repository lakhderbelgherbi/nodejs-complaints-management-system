const mongoose = require('mongoose');


const ticketSchema = mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    launch: { // how do this ticket was launched
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
        enum:['call', 'email', 'letter', 'present']
    },
    departement: { // we devided our teams base on departement
        type: new mongoose.Schema({
            team_name: {
                type: String,
                minlength: 3,
                maxlength: 255,
                trim: true,
                required: true
            }
        }),
        required: true,
    },
    customer: {
        type: new mongoose.Schema({
            first_name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
            last_name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
            email: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255,
            }
        }), 
        required: true
    },
    ticket_description: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    ticket_status: {
        type: String,
        default: 'New',
        enum: ['New', 'being_precessed', 'close']
    },
    comments: [],
    ticket_response: {
        type: String,
        minlength: 5,
        maxlength: 255,
    }
});


const Ticket = new mongoose.model('Ticket', ticketSchema);


module.exports.ticketSchema = ticketSchema;
module.exports.Ticket       = Ticket;