const express = require("express");
const mongodb = require("mongodb").MongoClient;
const app = express();
const fs = require("fs");
const port = 5000;

const url = "mongodb://127.0.0.1:27017";
let database; 

let connectDb = async () => {
  try {
    const connect = await mongodb.connect(url);
    database = connect.db("emp");
    await database.createCollection("users");
    console.log("Database is connected");
  } catch (err) {
    console.log(err);
  }
};

connectDb();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.createReadStream("./index.js").pipe(res);
});

app.post("/userend", async (req, res) => {
  try {
    await database.collection("users").insertOne(req.body);
    res.send("Data is inserted");
  } catch (err) {
    res.status(500).send("Error inserting data");
    console.log(err);
  }
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server has started on port ${port}`);
});
