import R from "ramda";

export default function computeBinMetadata (shots) {
  const count = shots.length;
  const made = shots.filter(R.prop("made")).length;
  const value = Number(shots[0].value);
  let percentage = made / count;
  if (percentage === Infinity) percentage = 0;
  let expectedValue = value * percentage;
  return { count, made, percentage, value, expectedValue };
}