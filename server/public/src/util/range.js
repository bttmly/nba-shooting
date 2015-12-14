export default function range (arr) {
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
