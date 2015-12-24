
import R from "ramda";
import {Promise} from "es6-promise";
import "whatwg-fetch";

import createLayout from "./create-layout";
import createBins from "./create-bins";
import drawLeague from "./draw-league";
import drawPlayer from "./draw-player";
import status     from "./status";

const LEAGUE = "@@LEAGUE";

const layout = createLayout();

const binCache = {};
const cacheBins = R.curry(function cacheBins (key, bins) {
  binCache[key] = bins;
  return bins;
});

const shotCache = {};
function fetchShots (id) {

  if (shotCache[id]) return Promise.resolve(shotCache[id]);

  let url = "/shots";
  if (id !== LEAGUE) url += ("/" + id);
  
  return fetch(url)
    .then(res => res.json())
    .then(data => (shotCache[id] = data, data))
}


let svg;

drawLeagueChart();
setupButtonHandler();

function disposeSvg () {
  if (svg == null) return;
  svg.parentElement.removeChild(svg);
  svg = null;
}

function attachSvg (_svg) {
  svg = _svg;
}

function drawLeagueChart () {
  disposeSvg();
  fetchShots(LEAGUE)
    .then(createBins(layout))
    .then(cacheBins("@@LEAGUE"))
    .then(drawLeague(layout))
    .then(attachSvg)
}

function drawPlayerChart (id) {
  disposeSvg();
  fetchShots(id)
    .then(createBins(layout))
    .then(cacheBins(id))
    .then(drawPlayer(layout, binCache["@@LEAGUE"]))
    .then(attachSvg)
}

function setupButtonHandler () {
  const button = document.getElementById("submit-btn");
  const input = document.getElementById("player-id")
  
  button.addEventListener("click", function () {
    disposeSvg();
    const id = input.value;
    if (id == 0) return drawLeagueChart();
    drawPlayerChart(id);
  });
}

global.onunhandledrejection = function (err) {
  if (err) {
    console.log(err.message, err.stack);
    throw err;
  }
  throw new Error("Mysterious error in promise");
}
