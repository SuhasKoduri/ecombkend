let express=require("express")
let mongoose=require("mongoose");
require("dotenv").config()
const rt = require("./Routes/rt");
let cors=require("cors")
let app=express()
mongoose.connect(process.env.uri).then(()=>{
    app.listen(process.env.port)
    console.log("ok")
}).catch(()=>{
    console.log("Error");
    
})
app.use(express.json())
app.use(cors())
app.use("/",rt)
app.use("/uploads", express.static("uploads"));