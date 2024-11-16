let express = require("express")
let admin = express.Router()

admin.get('/admin',(req,res)=>{
  res.send('<h2>Admin Home page</h2>')
})
module.exports= admin;


