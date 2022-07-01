//controller takes in action/request from user and works with them to update the model.
const { getAllPlanets } = require('../../models/planets.model');

function httpGetAllPlanets(req, res) {
    return res.status(200).json(getAllPlanets());
}

module.exports = {
    httpGetAllPlanets,
}