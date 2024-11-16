let express = require("express")
let router = express.Router()

router.get('/',(req,res)=>{
  res.send("home page")
  res.send()
})
router.get('/login',(req,res)=>{
  res.send('<h1>Login Home</h1>')
  res.send()
})


module.exports= router;