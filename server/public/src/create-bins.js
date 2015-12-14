import R from "ramda";
import d3 from "d3";

import range from "./util/range";
import {HEIGHT, WIDTH} from "./constants";

export default R.curry(function createBins (layout, shots) {
  shots = shots.map(makeShot);

  const xRange = range(R.pluck("x", shots));
  const yRange = range(R.pluck("y", shots));

  const xScale = d3.scale.linear()
    .domain(xRange)
    .range([0, WIDTH]);

  const yScale = d3.scale.linear()
    .domain(yRange)
    .range([0, HEIGHT * 2]);

  const scaledShots = shots.map(s => ({...s, scaledX: xScale(s.x), scaledY: yScale(s.y)}));

  return layout(scaledShots);
});

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