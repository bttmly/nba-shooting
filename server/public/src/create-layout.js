import R from "ramda";

import d3 from "d3"
import hexbinPlugin from "./hexbin"

import {WIDTH, HEIGHT, HEX_RADIUS} from "./constants"

hexbinPlugin(d3);

export default function createLayout () {
  return d3.hexbin()
    .size([WIDTH, HEIGHT])
    .radius(HEX_RADIUS)
    .x(R.prop("scaledX"))
    .y(R.prop("scaledY"));
}
