const express = require("express");
const app = express();
app.use("/",(req,res,next)=>{
  console.log("The First Middelware");
  next();
})
app.get("/user",(req,res,next)=>{
  try{
    console.log("The Second Middleware");
    res.send("Hello from Abhishek Shukla")
    next();
  }
  catch(err){
    res.status(404).send("Server Not Found")
  }
})
app.get("/about",(req,res)=>{
  try{
    console.log("the /about route is called");
    res.send(`<h1 style="color:red">Hello Forks This is Abhishek Shukla</h1>
      `)
  }
  catch(err){
    res.status(404).send("Data Not Be retrieved From the Data")
  }
})
app.listen(5000,(err)=>{
  if(err)throw err;
  console.log("Server Is been Started");
})