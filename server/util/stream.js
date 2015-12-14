exports.filter = function (f) {
  return T.obj(function (data, enc, next) {
    try {
      if (f(data)) this.push(data);
      return next();
    } catch (e) {
      next(e)
    }
  });
};

exports.map = function (f) {
  return T.obj(function (data, enc, next) {
    try {
      this.push(f(data));
      next();
    } catch (e) {
      next(e);
    }
  })
};

exports.jsonToResponse = function (st, res) {
  var previous;
  st.on("data", function (data) {
    if (previous) res.write(previous);
    previous = JSON.stringify(data) + ",";
  })
  .on("end", function () {
    res.end(previous + "]");
  });
};
