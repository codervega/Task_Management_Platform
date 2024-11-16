let express = require("express")
const router = require("./router.js")
let app = express()

// app.get('/',(req,res)=>{
//   res.send('Home page')
//   res.end();
// })
// app.get((req,res)=>{
//   res.send("Page Is not Found")
//   res.end()
// })
app.use('/',router)
module.exports = app