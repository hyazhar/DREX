const ExpressError = require("../utils/ExpressError");

const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;

  if (err instanceof ExpressError) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;