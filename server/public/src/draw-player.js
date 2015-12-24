import R from "ramda";
import Rainbow from "rainbowvis.js";
import d3 from "d3"

import range from "./util/range";
import computeBinMetadata from "./compute-bin-metadata";

import {HEX_RADIUS, SPECTRUM, THRESHOLD, WIDTH, HEIGHT} from "./constants";

export default R.curry(function drawLeague (layout, leagueBins, playerBins) {
  playerBins.map(attachBinMetadata);
  const binMetadata = R.pluck("metadata", playerBins)  // .filter(m => m.count > THRESHOLD);
  const indexedLeagueBins = indexBins(leagueBins.map(attachBinMetadata));


  // const expectedValueRange = range(R.pluck("expectedValue", binMetadata));
  const countRange = range(R.pluck("count", binMetadata));

  const rainbow = new Rainbow();
  rainbow.setSpectrum(...SPECTRUM);
  rainbow.setNumberRange(0, 5); // arbitrary

  let misses = [];
  let hits = 0;

  const sizeScale = d3.scale.log()
    .domain(countRange)
    .range([0, 1]);

  const svg = d3.select("body")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  const hexes = svg.append("g")
    .attr("class", "hexagons")
    .selectAll("path")
    .data(playerBins)
    .enter()
    .append("path")
    .attr("d", layout.hexagon(HEX_RADIUS - 0.5))
    .attr("transform", d => {
      let scaled = sizeScale(d.length);
      return `translate(${d.x}, ${d.y}) scale(${scaled}, ${scaled})`
    })
    // .attr("visibility", d => d.length < THRESHOLD ? "hidden" : "visibile")
    .style("fill", playerBin => {

      // TODO figure out how there can be bins for a player that are missing for league

      const key = playerBin.i + "," + playerBin.j;
      const leagueBin = indexedLeagueBins[key];
      let leaguePercentage;
      if (leagueBin) {
        leaguePercentage = leagueBin.metadata.percentage;
      } else {
        leaguePercentage = 0;
        misses.push(key);
      }

      const playerPercentage = playerBin.metadata.percentage;
      const color = (playerPercentage / leaguePercentage) || 0;
      return rainbow.colourAt(color)
    })
    .attr("data-percent", d => binPct(d))
    .attr("data-attempts", d => d.length)
    .attr("data-value", d => d[0].v);

  // wtf are these...?
  // console.log("misses", misses);
  global.misses = misses;
  global.indexedPlayerBins = indexBins(playerBins);
  global.indexedLeagueBins = indexedLeagueBins;

  return svg[0][0];
});

function binPct (bin) {
  return bin.filter(R.prop("made")).length / bin.length;
}

function indexBins (bins) {
  return bins.reduce(function (indexed, bin) {
    indexed[bin.i + "," + bin.j] = bin;
    return indexed;
  }, {})
}

function attachBinMetadata (bin) {
  bin.metadata = computeBinMetadata(bin);
  return bin;
}
