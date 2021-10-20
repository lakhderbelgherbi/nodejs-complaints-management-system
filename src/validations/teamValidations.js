const Joi = require('joi');


const teamRegister = (data) => {
    const schema = Joi.object({
        team_name: Joi.string().required().min(3).max(255),
        team_description: Joi.string().required().min(5).max(255)
    });

    return schema.validate(data);
};


const teamUpdate = (data) => {
    const schema = Joi.object({
        team_name: Joi.string().required().min(3).max(255),
        team_description: Joi.string().required().min(5).max(255)
    });

    return schema.validate(data);
};




module.exports.teamRegister = teamRegister;
module.exports.teamUpdate = teamUpdate;