const Joi = require('joi');

const customerRegister = (data) => {
    const schema = Joi.object({
        first_name: Joi.string().required().min(3).max(50),
        last_name: Joi.string().required().min(3).max(50),
        email: Joi.string().required().min(5).max(255).email(),
        phone: Joi.string().required().min(5).max(50),
    });

    return schema.validate(data);
}


const customerUpdate = (data) => {
    const schema = Joi.object({
        first_name: Joi.string().required().min(3).max(50),
        last_name: Joi.string().required().min(3).max(50),
        email: Joi.string().required().min(5).max(255).email(),
        phone: Joi.string().required().min(5).max(50),
    });

    return schema.validate(data);
}



module.exports.customerRegister = customerRegister;
module.exports.customerUpdate = customerUpdate;