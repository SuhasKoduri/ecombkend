let mongoose=require("mongoose")
let usersch=new mongoose.Schema({
    "_id":String,
    "name":String,
    "phno":String,
    "pwd":String,
    "role":String,
    "status":{
        type:String,
        default:"pending"
    }
})
let um=mongoose.model("user",usersch)
module.exports=um