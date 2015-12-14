
import R from "ramda";
import Promise from "es6-promise";
import "whatwg-fetch";

import createLayout from "./create-layout";
import createBins from "./create-bins";
import drawLeague from "./draw-league";
import drawPlayer from "./draw-player";

const layout = createLayout();

const binCache = {};
const cacheBins = R.curry(function cacheBins (key, bins) {
  binCache[key] = bins;
  return bins;
});

let svg;

function disposeSvg () {
  if (svg == null) return;
  svg.parentElement.removeChild(svg);
  svg = null;
}

function attachSvg (_svg) {
  svg = _svg;
}

disposeSvg();
fetch("/shots")
  .then(resp => resp.json())
  .then(createBins(layout))
  .then(cacheBins("@@LEAGUE"))
  .then(drawLeague(layout))
  .then(attachSvg)


function setupButtonHandler () {

  const button = document.getElementById("submit-btn");
  const input = document.getElementById("player-id")
  
  button.addEventListener("click", function () {
    disposeSvg();
    const id = input.value;
    fetch(`/streaming_shots/${id}`)
      .then(resp => resp.json())
      .then(createBins(layout))
      .then(cacheBins(id))
      .then(drawPlayer(layout, binCache["@@LEAGUE"]))
      .then(attachSvg)

  });
}

setupButtonHandler();

global.onunhandledrejection = function (err) {
  if (err) {
    console.log(err.stack);
    throw err;
  }
  throw new Error("Mysterious error in promise");
}
