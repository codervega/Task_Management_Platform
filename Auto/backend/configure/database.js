const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config();

const ConnectDB = async() => {
 try{
  await mongoose.connect(process.env.MONGO_URL);
  console.log("mongodb  connected");
 }
 catch(error){
  console.log("server failed to connect");
  console.log(error);
  process.exit(1);
 }
}

module.exports = ConnectDB;