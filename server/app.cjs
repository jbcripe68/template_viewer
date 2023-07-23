/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const morgan = require("morgan");
//const bodyParser = require("body-parser");
//const helmet = require("helmet");
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require("express-rate-limit");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const cors = require("cors");
const globalErrorHandler = require("./controllers/errorController.cjs");
const AppError = require("./utils/appError.cjs");

const app = express();

const templateRouter = require("./routes/template.cjs");

// Access-Control-Allow-Origin for all
app.use(cors());
app.options("*", cors());

// GLOBAL MIDDLEWARE

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests from same ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Watch for attackers overloading data size
app.use(express.json({ limit: "10kb" }));

// Data sanitization against XSS
app.use(xssClean());

// prevent parameter polution
app.use(hpp());

app.use(compression());

// ROUTES
app.use("/api/v1/template", templateRouter);

app.all("*", (req, res, next) => {
  //res.status(404).json({
  //    status: 'failed',
  //    message: `Cannot find ${req.originalUrl} on this server`
  //})
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
