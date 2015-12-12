var fs = require("fs");
var path = require("path");
var stream = require("stream");

var ndjson = require("ndjson");

var nba = require("nba").usePromises();
var R = require("ramda");
var T = require("through2");

function panic (err) {
  setTimeout(function () { throw err; });
}

var ND_JSON_FILE = path.join(__dirname, "../data/shots.ndjson");

var table;

function stringUnique () {
  table = Object.create(null);
  return function (str) {
    console.log(str);
    if (!table[str]) table[str] = true;
  }
}

function stringUnique () {
  var table = Object.create(null);
  return function (str, enc, next) {
    if (table[str]) return next();
    table[str] = true;
    next(null, str);
  }
}

function inc () {
  var i = 0;
  return function (data) {
    console.log(i++);
    return data;
  }
}

var log = T.obj(function (obj, enc, next) {
  console.log(obj);
  next(null, obj);
});


var intoTheEther = new stream.Writable({
  write: function (data, enc, next) {
    next();
  }
});

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

function add (set) {
  return function (data) {
    return set.add(data);
  }
}

var actions = {}

var rs = fs.createReadStream(ND_JSON_FILE)

var start = Date.now();

rs.on("close", function () {
  console.log(actions);
  console.log("count", Object.keys(actions).length);
  console.log("time", Date.now() - start);
});

rs.pipe(ndjson.parse())
  .pipe(streamify(R.prop("actionType")))
  .pipe(T.obj(function (action, enc, next) {
    // action = action.toLowerCase();
    if (actions[action] == null) actions[action] = 0;
    actions[action] += 1;
    next();
  }))
  .on("error", function (e) {
    console.log("HIT ERROR!");
    throw e;
  })