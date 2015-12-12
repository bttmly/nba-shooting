"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var R = require("ramda");

var Rainbow = require("rainbowvis.js");
var d3 = require("d3");
require("./hexbin")(d3);

var HEX_RADIUS = 23; // trial and error
var SPECTRUM = ["#3498db", "#2ecc71", "#f1c40f", "#e67e22", "#e74c3c"];
var THRESHOLD = 30;
var WIDTH = 1000;
var HEIGHT = 940;

function range(arr) {
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

function createHexbins(shots) {
  shots = shots.map(makeShot);

  var xRange = range(R.pluck("x", shots));
  var yRange = range(R.pluck("y", shots));

  var xScale = d3.scale.linear().domain(xRange).range([0, WIDTH]);

  var yScale = d3.scale.linear().domain(yRange).range([0, HEIGHT * 2]);

  var hexbin = d3.hexbin().size([WIDTH, HEIGHT]).radius(HEX_RADIUS).x(R.prop("scaledX")).y(R.prop("scaledY"));

  var scaledShots = shots.map(function (s) {
    return _extends({}, s, { scaledX: xScale(s.x), scaledY: yScale(s.y) });
  });

  var bins = hexbin(scaledShots);
  return [bins, hexbin];
}

function computeBinMetadata(shots) {
  var count = shots.length;
  var made = shots.filter(R.prop("made")).length;
  var value = Number(shots[0].value);
  var percentage = made / count;
  if (percentage === Infinity) percentage = 0;
  var expectedValue = value * percentage;
  return { count: count, made: made, percentage: percentage, value: value, expectedValue: expectedValue };
}

function ev(shots) {}

module.exports = function draw(shots) {
  var _createHexbins = createHexbins(shots);

  var _createHexbins2 = _slicedToArray(_createHexbins, 2);

  var bins = _createHexbins2[0];
  var hexbin = _createHexbins2[1];

  var binMetadata = bins.map(computeBinMetadata).filter(function (m) {
    return m.count > THRESHOLD;
  });

  var expectedValueRange = range(R.pluck("expectedValue", binMetadata));
  var countRange = range(R.pluck("count", binMetadata));

  var rainbow = new Rainbow();
  rainbow.setSpectrum.apply(rainbow, SPECTRUM);
  rainbow.setNumberRange.apply(rainbow, _toConsumableArray(expectedValueRange));

  var sizeScale = d3.scale.log().domain([THRESHOLD, countRange[1]]).range([0, 1]);

  var svg = d3.select("body").append("svg").attr("width", WIDTH).attr("height", HEIGHT);

  var hexes = svg.append("g").attr("class", "hexagons").selectAll("path").data(bins).enter().append("path").attr("d", hexbin.hexagon(HEX_RADIUS - 0.5)).attr("transform", function (d) {
    var scale = sizeScale(d.length);
    return "translate(" + d.x + ", " + d.y + ") scale(" + scale + ", " + scale + ")";
  }).attr("visibility", function (d) {
    return d.length < THRESHOLD ? "hidden" : "visibile";
  }).style("fill", function (d) {
    return rainbow.colourAt(binPct(d) * d[0].value);
  }).attr("data-percent", function (d) {
    return binPct(d);
  }).attr("data-attempts", function (d) {
    return d.length;
  }).attr("data-value", function (d) {
    return d[0].v;
  });
};

function binPct(bin) {
  return bin.filter(R.prop("made")).length / bin.length;
}

function makeShot(raw) {
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
    y: raw.locY
  };
}