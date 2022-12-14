var express = require("express");
var app = express();
var debug = require("debug");

// var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const csurf = require("csurf");

// var indexRouter = require("./routes/index");
require("./models/User");
require("./models/Tweet");
// make sure to import after this shit
require("./config/passport"); // <-- ADD THIS LINE
const passport = require("passport"); // <-- ADD THIS LINE
const usersRouter = require("./routes/api/users");
var tweetsRouter = require("./routes/api/tweets");
var csrfRouter = require("./routes/api/csrf");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());

// cors
const cors = require("cors");
const { isProduction } = require("./config/keys");
//* enable cors only in development
if (!isProduction) {
  app.use(cors());
}
// csurf
// YOU GOTTA PUT THIS BELOW THE COOKIE PARSER
console.log("getting here boi");
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);
console.log("also getting here boi");

// app.use("/", indexRouter);

app.use("/api/users", usersRouter);
app.use("/api/tweets", tweetsRouter);
app.use("/api/csrf", csrfRouter);

// catch all custom middleware
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.statusCode = 404;

  next(err);
});

const serverErrorLogger = debug("backend:error");

app.use((err, req, res, next) => {
  serverErrorLogger(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    statusCode,
    errors: err.errors,
  });
});

module.exports = app;
