"use strict";

const fs = require("fs");
const path = require("path");

const R = require("ramda");
const T = require("through2");
const ndjson = require("ndjson");

const S = require("../util/stream");

function streamingShots (req, res) {
  const id = req.params.id;

  res.writeHead(200, {"Content-Type": "application/json"})
  res.write("[");
  const predicate = id ? R.whereEq({playerId: Number(id)}) : R.T;

  var st = fs.createReadStream(path.join(__dirname, "../../data/shots.ndjson"))
    .pipe(ndjson.parse())
    .pipe(S.filter(predicate))

  S.jsonToResponse(st, res);
}

module.exports = streamingShots