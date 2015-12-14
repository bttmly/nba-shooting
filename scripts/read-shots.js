// basic skeleton code for doing streaming operations over shot data
// 
// I change this frequently during development and it's behavior should not be relied on.

var fs = require("fs");
var path = require("path");
var stream = require("stream");

var ndjson = require("ndjson");

var nba = require("nba").usePromises();
var R = require("ramda");
var T = require("through2");

var ND_JSON_FILE = path.join(__dirname, "public/data/shots.ndjson");

function streamify (f) {
  return T.obj(function (data, enc, next) {
    try {
      this.push(f(data))
      next()
    } catch (e) {
      next(e);
    }
  });
}

function streamFilter (f) {
  return T.obj(function (data, enc, next) {
    next(null, f(data) ? data : null);
  });
}

var rs = fs.createReadStream(ND_JSON_FILE)

var start = Date.now();
rs.on("close", function () {
  console.log("time", Date.now() - start);
});

rs.pipe(ndjson.parse())
  .pipe(streamFilter(R.whereEq({playerId: 201939, shotMadeFlag: 1})))
  .pipe(T.obj(function (data, enc, next) {
    count++;
    next();
  }));