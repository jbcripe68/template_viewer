/* eslint-disable global-require */

// Get the data from the JSON file depending on the NODE_ENV
let data;
if (process.env.NODE_ENV === "development") {
  data = require("./templates.json");
} else if (process.env.NODE_ENV === "production") {
  data = require("./extendedTemplate.json");
} else if (process.env.NODE_ENV === "test") {
  data = JSON.parse(process.env.testData);
} else {
  throw new Error(
    `Invalid NODE_ENV: ${
      process.env.NODE_ENV
        ? process.env.NODE_ENV
        : "must be 'development', 'production', or 'test'"
    }`
  );
}
/* Function getLength()
    returns the length of the data array.  This can be changed to point
    to a database at a later time.
*/
exports.getLength = () => data.length;

/* Function getPage()
    returns the requested page of the data array.  This function takes
    the folowing parameters:
    - page : the page number to return (0-based)
    - objsPerPage : the number of objects per page
    validation of the parameters is assumed to be done by the caller.  This
    function can also be changed to point to a database at a later time.
*/
exports.getPage = function (page, objsPerPage) {
  const offset = page * objsPerPage;
  return data.slice(offset, offset + objsPerPage);
};
