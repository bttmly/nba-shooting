const R = require("ramda");

const shots = require("../../data/shots.json");

function findShots (id) {
  return id ? shots.filter(R.propEq("playerId", Number(id))) : shots;
}

function getShots (req, res) {
  res.json(findShots(req.params.id));
}

module.exports = getShots;