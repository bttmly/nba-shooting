function min (arr) {
  return arr.reduce(function (min, current) {
    return current < min ? current : min;
  });
}

function max (arr) {
  return arr.reduce(function (min, current) {
    return current > min ? current : min;
  });
}

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

function twoDimensionalObject (rows, columns, value) {
  if (value == null) value = 0;

  function getValue (i, j) {
    return typeof value === "function" ? value(i, j) : value;
  }

  var ret = {}, i = 0, j = 0, key;

  for (; i < rows; i++) {
    for (; j < columns; j++) {
      ret[i + "," + j] = getValue(i, j);
    }
  }

  return ret;
}

function nullary (f) {
  return function () {
    return f();
  }
}

function createBinner (options) {
  var xProp = options.xProp;
  var yProp = options.yProp;
  var xPropValues = R.pluck(xProp, data);
  var yPropValues = R.pluck(yProp, data);
  var xRange = range(xPropValues);
  var yRange = range(yPropValues);

  // TODO allow sizes rather then length

  var xBinSize = xRange[1] - xRange[0] / options.xBinCount;
  var yBinSize = yRange[1] - yRange[0] / options.yBinCount;

  var xMinBin = Math.ceil(xRange[0] / xBinSize);
  var xMaxBin = Math.ceil(xRange[1] / xBinSize);
  var yMinBin = Math.ceil(yRange[0] / yBinSize);
  var yMaxBin = Math.ceil(yRange[1] / yBinSize);

  var container = twoDimensionalObject(xBinSize, yBinSize, nullary(Array));

  return {
    add: function (d) {
      var x = Math.floor(d[xProp] / xBinSize) + Math.abs(xMinBin);
      var y = Math.floor(d[xProp] / xBinSize) + Math.abs(yMinBin);
      var key = x + "," + y;

      if (container[key] == null) {
        throw new Error(`Out of bound key '${key}' on [${d[xProp]},${d[yProp]}]. x range ${xRange}, y range: ${yRange}`);
      }

      container[key].push(d);
    },

    view: function () {
      return R.map(R.identity, container);
    },

    map: function (f) {
      Object.keys(container).map(function (key) {
        var [x, y] = key.split(",");
        return f(container[key], x, y);
      });
    }
  }
}

function simpleShotBin (shots, x, y) {
  const count = shots.length
  const made = shots.filter(R.prop("shotMadeFlag")).length;
  const percentage = made / count;
  const value = Number(shots[0].shotType[0]);
  const expected = value / percentage;
  return { x, y, count, made, percentage, value, expected };
}

function shot (raw) {
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

// {
//   "gridType": "Shot Chart Detail",
//   "gameId": "0021500001",
//   "gameEventId": 20,
//   "playerId": 201952,
//   "playerName": "Jeff Teague",
//   "teamId": 1610612737,
//   "teamName": "Atlanta Hawks",
//   "period": 1,
//   "minutesRemaining": 9,
//   "secondsRemaining": 29,
//   "eventType": "Missed Shot",
//   "actionType": "Pullup Jump shot",
//   "shotType": "2PT Field Goal",
//   "shotZoneBasic": "Mid-Range",
//   "shotZoneArea": "Center(C)",
//   "shotZoneRange": "8-16 ft.",
//   "shotDistance": 15,
//   "locX": -2,
//   "locY": 154,
//   "shotAttemptedFlag": 1,
//   "shotMadeFlag": 0
// }

// TODO threshold
