Error.stackTraceLimit = Infinity;

var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var app = module.exports = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

app.use("/station/:stn", require("./server/departure"));
app.use("/nearest", require("./server/nearest"));

app.use(notFoundHandler);
app.use(errorHandler);

function notFoundHandler (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
}

// Not worried about leaking the stack
function errorHandler (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    name: err.name,
    stack: err.stack,
  });
}

var now = () => new Date().toString();

// global promise rejection handler
process.on("unhandledRejection", function (err) {
  console.log(now(), "Possibly unhandled promise rejection");
  console.log(now(), err.name, err.message);
  console.log(now(), err.stack);
  throw err;
});

app.set("port", Number(process.env.PORT) || 3000);
var server = app.listen(app.get("port"), function () {
  console.log("Express server listening on port", server.address().port);
});