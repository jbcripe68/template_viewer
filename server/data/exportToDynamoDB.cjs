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
  // create new table
  async function createTable() {
    return dynamodb
      .createTable({
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
      })
      .promise();
  }

  function waitForTableActive() {
    return new Promise((resolve, reject) => {
      async function describeTableUntilActive() {
        try {
          const description = await dynamodb
            .describeTable({ TableName: tableName })
            .promise();
          if (description.Table.TableStatus !== "ACTIVE") {
            console.log(
              `Waiting for new table to be ACTIVE: ${description.Table.TableStatus}`
            );
            return setTimeout(describeTableUntilActive, 2000);
          }
          console.log(
            `Continuing as table ${tableName} is now in ACTIVE state`
          );
          resolve(true);
        } catch (err) {
          reject(err);
        }
      }
      setTimeout(describeTableUntilActive, 2000);
    });
  }

  // see if table exists
  async function tableExists() {
    try {
      const data = await dynamodb.listTables({}).promise();
      //console.log(JSON.stringify(data, null, 2));
      if (data.TableNames.includes(tableName)) {
        return true;
      }

      let create = await prompt(
        `Table ${tableName} does not exist, do you want to create it? => `
      );
      create = create.toLowerCase();
      if (create.at(0) !== "y") {
        return false;
      }

      await createTable();

      await waitForTableActive();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async function writeItems(writeRequests) {
    await dynamodb
      .batchWriteItem({
        RequestItems: { [tableName]: writeRequests },
      })
      .promise();
    console.log(`${writeRequests.length} items written to ${tableName}`);
  }

  if (!(await tableExists())) {
    console.log("exiting because table not found.");
    process.exit(1);
  }

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
    while (writeRequests.length > 0) {
      const batch = writeRequests.splice(0, 25);
      writePromises.push(writeItems(batch));
    }
    await Promise.all(writePromises);

    console.log("Finished");
    process.exit(0);
  } else {
    console.log(`JSON in ${process.argv[2]} should be an array of objects`);
  }
}
const tableName = process.argv[3] || "template_viewer_data";
writeTable(tableName);
