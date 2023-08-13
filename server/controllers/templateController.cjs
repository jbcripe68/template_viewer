const AppError = require("../utils/appError.cjs");
/* eslint-disable import/no-dynamic-require */
const data = require("../data/data.cjs");

/* Function getTemplatePage:

   Routing function to get the requested page of data.  The function
   expects query parameters
   - page: page number (0-based and will default to 0)
   - objsPerPage: number of objects per page
   
   and after validating these parameters, it returns the requested page
   of data as a JSON object with the following properties:
   - status: "success"
   - results: number of objects returned on the page
   - numTotalPages: total number of pages available
   - data: array of objects on the requested page
*/
exports.getTemplatePage = async (req, res, next) => {
  let objsPerPage;
  if (req.query.objsPerPage) {
    const temp = Number(req.query.objsPerPage);
    if (!Number.isNaN(temp) && temp > 0) {
      objsPerPage = temp;
    }
  }
  if (typeof objsPerPage === "undefined") {
    return next(
      new AppError("Query parameter 'objsPerPage' is missing or invalid", 400)
    );
  }
  const numTotalPages = Math.ceil(data.getLength() / objsPerPage);

  // here we are using page as 0-based and defaulting to 0
  const page = Number(req.query.page ? req.query.page : 0);
  if (Number.isNaN(page) || page < 0) {
    return next(new AppError("Query parameter 'page' is invalid", 400));
  }

  if (page >= numTotalPages) {
    return next(
      new AppError(
        `Query parameter 'page' is out of range. Valid range is from 0 - ${
          numTotalPages - 1
        }`,
        400
      )
    );
  }
  const results = await data.getPage(page, objsPerPage);
  res.status(200).json({
    status: "success",
    results: results.length,
    numTotalPages,
    data: results,
  });
};
