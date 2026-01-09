let mongoose=require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose);
let prodsch=new mongoose.Schema({
    "_id":Number,
    "sid":String,
    "title":String,
    "desc":String,
    "price":Number,
    "rating":{
  type: Number,
  default: 5
},
    "img":String,
    "pubimg":String,
    "cat":String,
    "com":[]
})

prodsch.plugin(AutoIncrement, { inc_field: "_id", startAt:50000 });

let pm=mongoose.model("prods",prodsch)
module.exports=pm