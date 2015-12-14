var fs = require("fs");
var path = require("path");

var nba = require("nba").usePromises();
var R = require("ramda");

function panic (err) {
  setTimeout(function () { throw err; });
}

var DATA_DIR = path.join(__dirname, "../data");
var JSON_FILE = path.join(DATA_DIR, "shots.json");
var ND_JSON_FILE = path.join(DATA_DIR, "shots.ndjson");

var teams = nba.teams

function attempt (f) {
  var args = [].slice.call(arguments, 1);
  try {
    f.apply(args);
  } catch (e) {};
}

function leagueShots () {

  attempt(fs.mkdirSync, DATA_DIR);
  attempt(fs.unlinkSync, JSON_FILE);
  attempt(fs.unlinkSync, ND_JSON_FILE); 

  const teamToShots = R.pipe(
    R.prop("teamId"),
    R.objOf("teamId"),
    nba.stats.shots
  );

  return Promise.all(R.map(teamToShots, teams))
    .then(R.pluck("shot_Chart_Detail"))
    .then(R.flatten)
    .then(function (data) {
      fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
      return data;
    })
    .then(R.map(function (s) { fs.appendFileSync(ND_JSON_FILE, JSON.stringify(s) + "\n") }))
    .catch(panic);
}

module.exports = leagueShots;
