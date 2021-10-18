const Joi = require('joi');

const userRegistraion = (data) => {
    const schema = Joi.object({
        first_name: Joi.string().required().min(5).max(50),
        last_name: Joi.string().required().min(5).max(50),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255),
        phone: Joi.string().required().min(5).max(50),
        team: Joi.string(),
        photo: Joi.string(),
        role: Joi.array()
    });

    return schema.validate(data);
}

const userLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255)
    });

    return schema.validate(data);
}



module.exports.userRegistraion = userRegistraion;
module.exports.userLogin = userLogin;