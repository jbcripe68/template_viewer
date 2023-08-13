/* eslint-disable import/no-extraneous-dependencies */
const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });
const dynamodb = new AWS.DynamoDB();
let keys = [];
let TableName = "";

// Get the data from the DynamoDB table depending on the NODE_ENV
if (process.env.NODE_ENV === "development") {
  TableName = "template_viewer_data";
} else if (process.env.NODE_ENV === "production") {
  TableName = "template_viewer_data_prod";
} else {
  throw new Error(
    `Invalid NODE_ENV: ${
      process.env.NODE_ENV
        ? process.env.NODE_ENV
        : "must be 'development' or 'production'"
    }`
  );
}

// initialize "keys" from every item in dynamoDB table
dynamodb.scan(
  {
    TableName,
    ProjectionExpression: "id",
  },
  (err, data) => {
    if (err) throw err;
    keys = data.Items;
    console.log(
      `Scanned ${keys.length} items: ${JSON.stringify(keys, null, 2)}`
    );
  }
);

/* Function getLength()
    returns the length of the data array.  This can be changed to point
    to a database at a later time.
*/
exports.getLength = () => keys.length;

/* Function getPage()
    returns the requested page of the data array.  This function takes
    the folowing parameters:
    - page : the page number to return (0-based)
    - objsPerPage : the number of objects per page
    validation of the parameters is assumed to be done by the caller.  This
    function can also be changed to point to a database at a later time.
*/
exports.getPage = function (page, objsPerPage) {
  //  const offset = page * objsPerPage;
  //  return data.slice(offset, offset + objsPerPage);
  return new Promise((resolve, reject) => {
    dynamodb.scan(
      {
        TableName,
        Limit: objsPerPage,
        ExclusiveStartKey:
          page === 0 ? undefined : keys[objsPerPage * page - 1],
      },
      (err, data) => {
        if (err) reject(err);
        const pageData = data.Items.map((dynoItem) => {
          const item = {};
          Object.keys(dynoItem).forEach((key) => {
            item[key] = dynoItem[key].S;
          });
          return item;
        });
        console.log(`Page[${page}]: ${JSON.stringify(pageData)}`);
        resolve(pageData);
      }
    );
  });
};
