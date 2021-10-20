const mongoose = require('mongoose');


const teamSchema = mongoose.Schema({
    team_name: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 255,
        unique: true
    },
    team_description: {
        type: String,
        minlength: 5,
        maxlength: 255
    }
});


const Team = new mongoose.model('Team', teamSchema);

module.exports.teamSchema = teamSchema;
module.exports.Team = Team;