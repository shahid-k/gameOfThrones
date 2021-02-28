const { Schema } = require("mongoose");
const Mongoose = require("mongoose");
Mongoose.Promise = global.Promise;
Mongoose.set("useCreateIndex", true);
// const url = "mongodb://localhost:27017/test";
// let conn = require("./orderConnection");

require("dotenv").config({ path: "./import/.env" });

let host = process.env.host;
let username = process.env.user;
let password = process.env.password;
let database = process.env.database;

let collection = process.env.collection;
const uri = "mongodb+srv://" + username + ":" + password + "@" + host;

console.log(uri);
// console.log(conn.getDB());

const DataSchema = Schema(
  {
    _id: String,
    name: String,
    year: String,
    battle_number: String,
    attacker_king: String,
    defender_king: String,
    attacker_1: String,
    attacker_2: String,
    attacker_3: String,
    attacker_4: String,
    defender_1: String,
    defender_2: String,
    defender_3: String,
    defender_4: String,
    attacker_outcome: String,
    battle_type: String,
    major_death: String,
    major_capture: String,
    attacker_size: String,
    defender_size: String,
    attacker_commander: String,
    defender_commander: String,
    summer: String,
    location: String,
    region: String,
    note: String,
  },
  { collection: collection, timestamps: true }
);

let dataDumpCollection = {};

dataDumpCollection.getCollection = () => {
  return Mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
    .then((database) => {
      return database.model(collection, DataSchema);
    })
    .catch((error) => {
      let err = new Error("Could not connect to Database");
      console.error(error);
      err.status = 500;
      throw err;
    });
};
module.exports = dataDumpCollection;
