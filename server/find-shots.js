const R = require("ramda");

const shots = require("../data/shots.json");

module.exports = function findShots (id) {
  return id ? shots.filter(R.propEq("playerId", Number(id))) : shots;
}