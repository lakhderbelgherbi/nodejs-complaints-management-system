const express = require('express');
const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const { Team } = require('../models/team');
const { teamRegister, teamUpdate } = require('../validations/teamValidations');
const router = express.Router();


// Teams list
router.get('/', [auth, admin], async (req, res) => {
    const teams = await Team.find();
    return res.send(teams);
});
// Retrieve team b ID
router.get('/:id', [auth, admin], async (req, res) => {
    const team = await Team.findById(req.params.id);
    if(!team) return res.status(404).send('The team with the given ID was not found');

    return res.send(team);
})

// Create new team
router.post('/',[auth, admin], async (req, res)  => {
    const { error } = teamRegister(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let team = await await Team.findOne({team_name: req.body.team_name});
    if(team) return res.status(400).send('The team with the given name already exists, please select another name!');

    team = new Team({
        team_name: req.body.team_name,
        team_description: req.body.team_description
    });

    await team.save();

    return res.send(team);
});

// Update existing team
router.put('/:id',[auth, admin], async (req, res) => {
    const { error } = teamUpdate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let team = await Team.findByIdAndUpdate({_id: req.params.id}, {
        $set: {
            team_name: req.body.team_name,
            team_description: req.body.team_description
        }
    });

    if(!team) return res.status(404).send('The team with the given ID was not found');

    return res.send(team);
});


// Delete Team
router.delete('/:id',[auth, admin], async (req, res) => {
    const team = await Team.findByIdAndRemove({_id: req.params.id});
    if(!team) return res.status(404).send('The team with the given ID was not found');

    return res.send(team);
})





module.exports = router