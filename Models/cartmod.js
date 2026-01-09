let mongoose=require("mongoose")
const { v7: uuidv7 } = require("uuid");
let cartsch=new mongoose.Schema({
    "_id":{
  type: String,
  default: uuidv7
},
    "uid":String,
    "pid":Number,
    "qty":Number,
    "price":Number,
    "img":String,
    "title":String,
    "cat":String
})
let cm=mongoose.model("cart",cartsch)
module.exports=cm