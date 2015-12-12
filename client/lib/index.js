"use strict";

var draw = require("./draw");

var app = {};

fetch("/data/shots.json").then(function (resp) {
  return resp.json();
}).then(draw).catch(function (err) {
  console.error("ERROR IN PROMISE:", err);
  setTimeout(function () {
    throw err;
  });
});