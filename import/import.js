const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");
// let url = "mongodb://username:password@localhost:27017/";
// let url = "mongodb://localhost:27017/";

require("dotenv").config();

let host = process.env.host;
let username = process.env.user;
let password = process.env.password;
let database = process.env.database;
let collection = process.env.collection;
let filename = process.env.filename;
const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://" + username + ":" + password + "@" + host;

const client = new MongoClient(
  uri,
  { useUnifiedTopology: true },
  { useNewUrlParser: true },
  { connectTimeoutMS: 30000 },
  { keepAlive: 1 }
);
client.connect((err) => {
  csvtojson()
    .fromFile(filename)
    .then((csvData) => {
      console.log(csvData);
      client
        .db(database)
        .collection(collection)
        .insertMany(csvData, (err, res) => {
          if (err) throw err;
          console.log(`Inserted: ${res.insertedCount} rows`);
        });
    });
});
client.close();
