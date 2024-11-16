const express = require("express")
const app = express()

app.use((req,res,next)=>{
  req.user = 'dinga'
  console.log("hello i am in 1st middlware")
  next()
})
app.use((req,res,next)=>{
  console.log("Hllow i am 2nd Middlware",req.user);
  next()
})

app.get('/',(req,res)=>{
  res.send(`welcome ${req.user}`)
})

const port = 5000;

app.listen(port,err=>{
    if(err) throw err;
    console.log("App is Ready");
})