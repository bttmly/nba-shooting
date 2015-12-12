const R = require("ramda");

const Rainbow = require("rainbowvis.js");
const d3 = require("d3"); 
require("./hexbin")(d3);

const HEX_RADIUS = 23; // trial and error
const SPECTRUM = ["#3498db", "#2ecc71", "#f1c40f", "#e67e22", "#e74c3c"]
const THRESHOLD = 30;
const WIDTH = 1000;
const HEIGHT = 940;

function range (arr) {
  var min = Number.POSITIVE_INFINITY;
  var max = Number.NEGATIVE_INFINITY;
  var len = arr.length;
  var i = 0;
  var e;

  for (; i < len; i++) {
    e = arr[i];
    if (e < min) min = e;
    if (e > max) max = e;
  }

  return [min, max];
}

function createHexbins (shots) {
  shots = shots.map(makeShot);

  const xRange = range(R.pluck("x", shots));
  const yRange = range(R.pluck("y", shots));

  const xScale = d3.scale.linear()
    .domain(xRange)
    .range([0, WIDTH]);

  const yScale = d3.scale.linear()
    .domain(yRange)
    .range([0, HEIGHT * 2]);

  const hexbin = d3.hexbin()
    .size([WIDTH, HEIGHT])
    .radius(HEX_RADIUS)
    .x(R.prop("scaledX"))
    .y(R.prop("scaledY"));

  const scaledShots = shots.map(s => ({...s, scaledX: xScale(s.x), scaledY: yScale(s.y)}));

  const bins = hexbin(scaledShots);
  return [bins, hexbin];
}


function computeBinMetadata (shots) {
  const count = shots.length;
  const made = shots.filter(R.prop("made")).length;
  const value = Number(shots[0].value);
  let percentage = made / count;
  if (percentage === Infinity) percentage = 0;
  let expectedValue = value * percentage;
  return { count, made, percentage, value, expectedValue };
}

module.exports = function draw (shots) {
  const [bins, hexbin] = createHexbins(shots);
  const binMetadata = bins.map(computeBinMetadata).filter(m => m.count > THRESHOLD);

  const expectedValueRange = range(R.pluck("expectedValue", binMetadata));
  const countRange = range(R.pluck("count", binMetadata));

  const rainbow = new Rainbow();
  rainbow.setSpectrum(...SPECTRUM);
  rainbow.setNumberRange(...expectedValueRange);

  const sizeScale = d3.scale.log()
    .domain([THRESHOLD, countRange[1]])
    .range([0, 1]);

  const svg = d3.select("body")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  const hexes = svg.append("g")
    .attr("class", "hexagons")
    .selectAll("path")
    .data(bins)
    .enter()
    .append("path")
    .attr("d", hexbin.hexagon(HEX_RADIUS - 0.5))
    .attr("transform", d => {
      const scale = sizeScale(d.length);
      return `translate(${d.x}, ${d.y}) scale(${scale}, ${scale})`
    })
    .attr("visibility", d => d.length < THRESHOLD ? "hidden" : "visibile")
    .style("fill", d => rainbow.colourAt(binPct(d) * d[0].value))
    .attr("data-percent", d => binPct(d))
    .attr("data-attempts", d => d.length)
    .attr("data-value", d => d[0].v)
}

function binPct (bin) {
  return bin.filter(R.prop("made")).length / bin.length;
}

function makeShot (raw) {
  return {
    gameId: raw.gameId,
    playerId: raw.playerId,
    teamId: raw.teamId,
    period: raw.period,
    distance: raw.shotDistance,
    made: !!raw.shotMadeFlag,
    value: Number(raw.shotType[0]),
    minutes: raw.minutesRemaining,
    seconds: raw.secondsRemaining,
    x: raw.locX,
    y: raw.locY,
  }
}