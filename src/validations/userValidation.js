const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

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


const userUpdateRegistraion = (data) => {
    const schema = Joi.object({
        first_name: Joi.string().required().min(5).max(50),
        last_name: Joi.string().required().min(5).max(50),
        phone: Joi.string().required().min(5).max(50),
    });

    return schema.validate(data);
}


const passwordReset = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().min(5).max(255).email()
    });

    return schema.validate(data);
}


const passwordResetFormValidation = (data) => {
    const schema = Joi.object({
        password: Joi.string().required().min(5).max(255)
    });

    return schema.validate(data);
}

const changePasswordValidation = (data) => {
    const schema = Joi.object({
        password: Joi.string().required().min(5).max(255)
    });

    return schema.validate(data);
}



const userSetRoleValidation = (data) => {
    const schema = Joi.object({
        role: Joi.string().required().min(5).max(255)
    });

    return schema.validate(data);
}



const userSetTeamValidation = (data) => {
    const schema = Joi.object({
        team: Joi.objectId().required()
    });

    return schema.validate(data);
}





module.exports.userRegistraion = userRegistraion;
module.exports.userLogin = userLogin;
module.exports.userUpdateRegistraion = userUpdateRegistraion;
module.exports.passwordReset = passwordReset;
module.exports.passwordResetFormValidation = passwordResetFormValidation;
module.exports.changePasswordValidation = changePasswordValidation;
module.exports.userSetRoleValidation = userSetRoleValidation;
module.exports.userSetTeamValidation = userSetTeamValidation;