/* eslint-disable-next-line */
const AWS = require("aws-sdk");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt = (query) =>
  new Promise((resolve) => {
    rl.question(query, resolve);
  });

AWS.config.update({ region: "us-east-2" });

const dynamodb = new AWS.DynamoDB();

if (process.argv.length < 3) {
  console.log(
    "Usage: <json file to upload> <dynamodb table name default:template_viewer_data (must already exist)>"
  );
  process.exit(1);
}

let jsonFile = process.argv[2];
if (jsonFile.indexOf("/") === -1) {
  jsonFile = `./${jsonFile}`;
}
/* eslint-disable-next-line */
const jsonData = require(jsonFile);

async function writeTable(tableName) {
  // describe table
  async function describeTable() {
    return new Promise((resolve, reject) => {
      dynamodb.describeTable({ TableName: tableName }, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  }

  // create new table
  async function createTable() {
    return new Promise((resolve, reject) => {
      dynamodb.createTable(
        {
          TableName: tableName,
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        (err, data) => {
          if (err) return reject(err);
          console.log(JSON.stringify(data, null, 2));
          resolve();
        }
      );
    });
  }

  // see if table exists
  async function tableExists() {
    return new Promise((resolve, reject) => {
      dynamodb.listTables({}, async (err, data) => {
        if (err) return reject(err);
        console.log(JSON.stringify(data, null, 2));
        if (data.TableNames.includes(tableName)) {
          return resolve(true);
        }

        let create = await prompt(
          `Table ${tableName} does not exist, do you want to create it? => `
        );
        create = create.toLowerCase();
        if (create.at(0) !== "y") {
          return resolve(false);
        }

        await createTable();

        async function waitForTableActive() {
          const description = await describeTable();
          if (description.Table.TableStatus !== "ACTIVE") {
            console.log(
              `Waiting for new table to be active: ${description.Table.TableStatus}`
            );
            return setTimeout(waitForTableActive, 2000);
          }
          console.log(
            `Continuing as table ${tableName} is now in ACTIVE state`
          );
          resolve(true);
        }
        setTimeout(waitForTableActive, 2000);
      });
    });
  }

  function writeItems(writeRequests) {
    return new Promise((resolve, reject) => {
      dynamodb.batchWriteItem(
        {
          RequestItems: { [tableName]: writeRequests },
        },
        (err) => {
          if (err) return reject(err);
          console.log(`${writeRequests.length} items written to ${tableName}`);
          resolve();
        }
      );
    });
  }

  if (!(await tableExists())) process.exit(1);

  if (Array.isArray(jsonData)) {
    const writeRequests = jsonData.map((rec) => ({
      PutRequest: {
        Item: {
          id: {
            S: rec.id,
          },
          title: {
            S: rec.title,
          },
          cost: {
            S: rec.cost,
          },
          description: {
            S: rec.description,
          },
          thumbnail: {
            S: rec.thumbnail,
          },
          image: {
            S: rec.image,
          },
        },
      },
    }));

    const writePromises = [];
    while (writeRequests.length > 25) {
      const batch = writeRequests.splice(0, 25);
      writePromises.push(writeItems(batch));
    }
    await Promise.all(writePromises);

    console.log("Finished");
  } else {
    console.log(`JSON in ${process.argv[2]} should be an array of objects`);
  }
}
const tableName = process.argv[3] || "template_viewer_data";
writeTable(tableName);
