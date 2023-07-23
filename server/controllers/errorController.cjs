//const AppError = require("../utils/appError");

const sendErrorDevelopment = (err, req, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProduction = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  return res.status(500).json({
    status: "error",
    message: "Something went wrong...",
  });
};

// const HandleCastErrorDB = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}`;
//   return new AppError(message, 400);
// };

// const HandleValidationErrorDB = (err) => {
//   const validation_strings = [];
//   const validation_errors = err.errors || {};
//   Object.keys(validation_errors).forEach((key) => {
//     validation_strings.push(`${key}: ${validation_errors[key].message}`);
//   });
//   const message = `Validation Errors: ${validation_strings.join(", ")}`;
//   return new AppError(message, 400);
// };

// const HandleDuplicateFieldDB = (err) => {
//   const duplicate_strings = [];
//   const duplicate_error_keys = err.keyPattern || {};
//   const duplicate_error_values = err.keyValue || {};
//   Object.keys(duplicate_error_keys).forEach((key) => {
//     duplicate_strings.push(`${key}: ${duplicate_error_values[key]}`);
//   });
//   const message = `Duplicate field values, please use another value: ${duplicate_strings.join(
//     ", "
//   )}`;
//   return new AppError(message, 400);
// };

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.error(`ERROR: 💥(${process.env.NODE_ENV}):`, err);
  if (process.env.NODE_ENV === "development") {
    sendErrorDevelopment(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    const error = Object.assign(err);
    console.log(error.name);

    // if (err.name === "CastError") {
    //   error = HandleCastErrorDB(error);
    // }
    // if (err.name === "ValidationError") {
    //   error = HandleValidationErrorDB(error);
    // }
    // if (error.code === 11000) {
    //   error = HandleDuplicateFieldDB(error);
    // }
    sendErrorProduction(error, req, res);
  }
};
