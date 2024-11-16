let app = require("./app.js")
// const app = express();
const admin = require("./admin.js")
const router = require("./router.js")
let port = 5000;

app.use('/',router)
app.use('/',admin)



app.listen(port,(err)=>{
  if(err) throw err;
  console.log("Sever is Started at Port Number",port);
})