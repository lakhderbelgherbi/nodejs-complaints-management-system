const express = require('express');
const { Customer } = require('../models/customer');
const { Ticket } = require('../models/ticket');
const { Team } = require('../models/team');
const { ticketRegister, ticketUpdate, ticketComment, ticketStatus, ticketClose } = require('../validations/ticketsValidations');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const teamleader = require('../middlewares/teamleader');
const router  = express.Router();

// Tickets list
router.get('/', [auth, admin], async (req, res) => {
    const tickets = await Ticket.find();
    res.send(tickets);
});



// Get tickets by department
router.get('/:departmentId', [auth, teamleader], async (req, res) => {
    const tickets = await Ticket.findOne({
        "departement._id": req.params.departmentId
    });
    res.send(tickets);
});


// Create new Ticket
router.post('/', auth,async (req, res) => {
    const { error } = ticketRegister(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).send('The customer with the given ID was not found!');

    const team = await Team.findById(req.body.departementId);
    if(!team) return res.status(404).send('The Departement with the given ID was not found!');
   
    let ticket = new Ticket({
        title: req.body.title,
        launch: req.body.launch,
        departement: {
            _id: team._id,
            team_name: team.team_name
        },
        customer: {
            _id: customer._id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email
        },
        ticket_description: req.body.ticket_description
    });

    await ticket.save()

    return res.send(ticket);
});


//Update existing ticket
router.put('/:id', auth, async (req, res) => {
    const { error } = ticketUpdate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).send('The customer with the given ID was not found!');

    const team = await Team.findById(req.body.departementId);
    if(!team) return res.status(404).send('The Departement with the given ID was not found!');

    let ticket = await Ticket.findById(req.params.id);
    if(!ticket) return res.status(400).send('The Ticket with the given ID was not found!!');

    
    ticket.title                    = req.body.title,
    ticket.launch                   = req.body.launch,
    ticket.departement._id          =  team._id,
    ticket.departement.team_name    = team.team_name
    ticket.customer._id             = customer._id,
    ticket.customer.first_name      = customer.first_name,
    ticket.customer.last_name       = customer.last_name,
    ticket.customer.email           = customer.email
    ticket.ticket_description       = req.body.ticket_description

    await ticket.save()

    return res.send(ticket);
});


// Add comment for ticket by user
router.put('/:ticketId/commented/:userId', auth, async (req, res) => {
    const { error } = ticketComment(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let ticket = await Ticket.findById(req.params.ticketId);
    if(!ticket) return res.status(400).send('The ticket with the given ID was not found!!');

    ticket.comments.push(req.body.commentBody);

    await ticket.save()

    return res.send(ticket);

});


// Change ticket status
router.put('/:ticketId/changestatus', auth, async(req, res) => {
    const { error } = ticketStatus(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    
    let ticket = await Ticket.findById(req.params.ticketId);
    if(!ticket) return res.status(400).send('The ticket with the given ID was not found!!');

    ticket.ticket_status = req.body.status;

    await ticket.save()

    return res.send(ticket);
});

// Close ticket with response
router.put('/:ticketId/close', auth, async(req, res) => {
    const { error } = ticketClose(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let ticket = await Ticket.findById(req.params.ticketId);
    if(!ticket) return res.status(400).send('The ticket with the given ID was not found!!');

    ticket.ticket_status = req.body.ticket_status;
    ticket.ticket_response = req.body.ticket_response;


    await ticket.save()
    return res.send(ticket);
});



module.exports = router;
