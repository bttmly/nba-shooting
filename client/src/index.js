
const draw = require("./draw");

const app = {};

fetch("/data/shots.json")
  .then(resp => resp.json())
  .then(draw)
  .catch(function (err) {
    console.error("ERROR IN PROMISE:", err);
    setTimeout(function () { throw err });
  });
