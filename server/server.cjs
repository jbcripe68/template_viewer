//const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
require("dotenv").config({ path: `${__dirname}/config.env` });
const app = require("./app.cjs");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err);
  process.exit(1);
});

//const db_conn_str = process.env.DATABASE.replace(
//  "<PASSWORD",
//  process.env.DATABASE_PASSWORD
//);
//console.log(db_conn_str);
// mongoose
//   .connect(db_conn_str, {
//     user: process.env.DATABASE_USER,
//     pass: process.env.DATABASE_PASSWORD,
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log('DB connection successful');
//   });
//console.log('past mongoose.connect()');

/*const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'The Park Camper',
    price: 997
});

testTour.save()
    .then((doc) => {
        console.log(doc);
    })
    .catch(err => {
        console.error('ERROR 💥:', err);
    }); */

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED! 🤪 Shutting down gracefully...");
  server.close(() => {
    console.log("💥 Process terminated");
  });
});
