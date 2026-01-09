const pm = require("../Models/prodmod")
const multer  = require('multer')
const fs = require("fs");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+"."+file.mimetype.split("/")[1]
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })



let getprods=async(req,res)=>{
try{
    let data=await pm.find()
    res.json(data)
}
catch(err){
    res.json({"msg":"Couldn't Fetch Products"})
    console.log(err);
    
}
}


let addprod=async(req,res)=>{
    try{
        let data=new pm({...req.body,"img":req.file.path,"rating":5})
        await data.save()
        res.json({"msg":"Product Added Successful"})
    }
    catch(err){
       res.json({"msg":"Couldn't Add Products"}) 
       console.log(err);
       
    }
}

let getprod=async(req,res)=>{
  try{
    let data=await pm.findById(req.params.pid)
    res.json(data)
  }
  catch(err){
    console.log(err);
    
  }
}

let upddet=async(req,res)=>{
  try{
    await pm.findByIdAndUpdate({"_id":req.body._id},req.body)
    res.json({"msg":"Details Updated"})
  }
  catch(err){
    console.log(err)
  }
}

let updimg = async (req, res) => {
  try {
        let data=new pm({"img":req.file.path})
        const oldPath = path.join(__dirname,"../uploads",data.img);
        fs.rm(oldPath, { force: true }, (err) => {
          if (err) console.log("Delete error:", err);
        });
        await pm.findByIdAndUpdate({"_id":req.body._id},data)
        res.json({"msg":"Product Added Successful"})
  }
  catch(err){
    console.log(err)
  }
}

let del=async(req,res)=>{
  try{
    let data=await pm.findByIdAndDelete(req.params.pid)
    const oldPath = path.join(__dirname,"..",data.img);
        fs.rm(oldPath, { force: true }, (err) => {
          if (err) console.log("Delete error:", err);
        });
    res.json({"msg":"Product Deleted"})
  }
  catch(err)
  {
    console.log(err);
    
  }
}

let addcmt = async (req, res) => {
  try {

     await pm.findByIdAndUpdate(req.body._id,{ $push: { com: req.body.com } })
    let prod = await pm.findById(req.body._id)
    let total = 0
    prod.com.forEach(c => {
      total += Number(c.rt)
    })
    let avg = prod.com.length ? total / prod.com.length : 0
    await pm.findByIdAndUpdate(req.body._id,{ rating: avg })
    res.json({ msg: "Comment added & rating updated", avg })

  }
  catch (err) {
    console.log(err)
  }
}


let ser=async (req, res) => {
  try {
    console.log(req.body.ser)
    const q = req.body.ser;
    if(q!=undefined)
    {
    const data = await pm.find({ $or: [{ title: { $regex: q, $options: "i" } },{ desc: { $regex: q, $options: "i" } } ] })
    console.log(data)
    res.json(data);
    }
    else{
      res.json(await pm.find())
    }
  } catch (err) {
    res.json({ error: err.message });
  }
}


let fil=async(req,res)=>{
  try{
    let obj={}
    if(req.body.cat) obj.cat=req.body.cat
    if(req.body.price) obj.price={$lt:Number(req.body.price)}
    if(req.body.rating) obj.rating={$gt:Number(req.body.rating)}
    let data=await pm.aggregate([{$match:obj}]) 
    res.json(data)
  }
  catch(err){
    console.log(err)
  }
}

module.exports={getprods,addprod,upload,getprod,upddet,updimg,del,addcmt,ser,fil}