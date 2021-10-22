const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const ticketRegister = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().min(3).max(255).trim(),
        launch: Joi.string().required().min(3).max(255).trim(),
        departementId: Joi.objectId().required(),
        customerId: Joi.objectId().required(),
        ticket_description: Joi.string().required().min(3).max(255).trim()
    });

    return schema.validate(data);
}


const ticketUpdate = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().min(3).max(235).trim(),
        launch: Joi.string().required().min(3).max(235).trim(),
        departementId: Joi.objectId().required(),
        customerId: Joi.objectId().required(),
        ticket_description: Joi.string().required().min(5).max(255).trim()
    });

    return schema.validate(data);
}

const ticketComment = (data) => {
    const schema = Joi.object({
        commentBody: Joi.string().required().min(3).max(235).trim(),
    });

    return schema.validate(data);
};


const ticketStatus = (data) => {
    const schema = Joi.object({
        status: Joi.string().required().min(3).max(235).trim(),
    });

    return schema.validate(data);
};



const ticketClose = (data) => {
    const schema = Joi.object({
        ticket_status: Joi.string().required().min(3).max(235).trim(),
        ticket_response: Joi.string().required().min(3).max(235).trim(),
    });

    return schema.validate(data);
};











module.exports.ticketRegister = ticketRegister;
module.exports.ticketUpdate = ticketUpdate;
module.exports.ticketComment = ticketComment;
module.exports.ticketStatus = ticketStatus;
module.exports.ticketClose = ticketClose;