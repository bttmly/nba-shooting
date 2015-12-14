var fs = require("fs");
var path = require("path");

var rimraf = require("rimraf");
var nba = require("nba").usePromises();
var R = require("ramda");

function panic (err) {
  setTimeout(function () { throw err; });
}

var DATA_DIR = path.join(__dirname, "../data");
var JSON_FILE = path.join(DATA_DIR, "shots.json");
var ND_JSON_FILE = path.join(DATA_DIR, "shots.ndjson");

var teams = nba.teams

// change this if desired
var options = {season: "2015-16"};

function leagueShots () {

  try {
    rimraf.sync(DATA_DIR);
  } catch (e) {}
  fs.mkdirSync(DATA_DIR);

  const teamToShots = R.pipe(
    R.prop("teamId"),
    R.objOf("teamId"),
    R.merge(options),
    nba.stats.shots
  );

  return Promise.all(R.map(teamToShots, teams))
    .then(R.pluck("shot_Chart_Detail"))
    .then(R.flatten)
    .then(function (data) {
      fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
      return data;
    })
    .then(data => (console.log("COUNT", data.length), data))
    .then(R.map(function (s) { fs.appendFileSync(ND_JSON_FILE, JSON.stringify(s) + "\n") }))
    .catch(panic);
}

leagueShots();
