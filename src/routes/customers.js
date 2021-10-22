const express = require('express');
const { Customer } = require('../models/customer');
const { customerRegister } = require('../validations/customerValidations');
const auth = require('../middlewares/auth');
const router = express.Router();

// Customers list
router.get('/', auth, async (req, res) => {
    const customers = await Customer.find();
    return res.send(customers);
});

// Create new customer
router.post('/', auth, async (req, res) => {
    const { error } = customerRegister(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findOne({email: req.body.email});
    if(customer) return res.status(400).send('The customer with the given Email already exists, Please enter a new email');

    customer = new Customer({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone
    });

    await customer.save();

    res.send(customer);

});


// Update an existing customer
router.put('/:id', auth, async (req, res) => {
    const { error } = customerRegister(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findByIdAndUpdate({_id: req.params.id}, {
        $set: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone
        }
    });

    if(!customer) return res.status(404).send('The customer with the given ID was not found');

    res.send(customer);

});

// Delete customer
router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(404).send('The customer with the given ID was not found');

    return res.send(customer);
});

// Retrieve customer by ID
router.get('/:id', auth, async (req, res) => {
    const customer = await Customer.findById(req.params.id).select('-_id -__v');
    if(!customer) return res.status(404).send('The Customer with the given ID was not found');

    res.send(customer);
});





module.exports = router;