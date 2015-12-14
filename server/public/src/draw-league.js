import R from "ramda";
import Rainbow from "rainbowvis.js";
import d3 from "d3"

import range from "./util/range";
import computeBinMetadata from "./compute-bin-metadata";

import {HEX_RADIUS, SPECTRUM, THRESHOLD, WIDTH, HEIGHT} from "./constants";

export default R.curry(function drawLeague (layout, bins) {
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
    .attr("d", layout.hexagon(HEX_RADIUS - 0.5))
    .attr("transform", d => {
      const scale = sizeScale(d.length);
      return `translate(${d.x}, ${d.y}) scale(${scale}, ${scale})`
    })
    .attr("visibility", d => d.length < THRESHOLD ? "hidden" : "visibile")
    .style("fill", d => rainbow.colourAt(binPct(d) * d[0].value))
    .attr("data-percent", d => binPct(d))
    .attr("data-attempts", d => d.length)
    .attr("data-value", d => d[0].v);

  return svg[0][0];
});

function binPct (bin) {
  return bin.filter(R.prop("made")).length / bin.length;
}
