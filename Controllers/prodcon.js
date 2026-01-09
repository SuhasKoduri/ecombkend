const pm = require("../Models/prodmod")
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",              // Cloudinary folder name
    format: async (req, file) => "webp",
    public_id: (req, file) =>
      `img-${Date.now()}-${Math.round(Math.random() * 1e9)}`
  }
});

const upload = multer({ storage });




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
        let data=new pm({...req.body,"img":req.file.path,"pubimg": req.file.filename,"rating":5})
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
    const product = await pm.findById(req.body._id);

    // delete old image from cloudinary
    if (product.pubimg) {
      await cloudinary.uploader.destroy(product.pubimg);
    }

    await pm.findByIdAndUpdate(req.body._id, {
      img: req.file.path,
      pubimg: req.file.filename
    });

    res.json({ msg: "Image Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Couldn't Update Image" });
  }
};


let del = async (req, res) => {
  try {
    const product = await pm.findByIdAndDelete(req.params.pid);

    if (product?.pubimg) {
      await cloudinary.uploader.destroy(product.pubimg);
    }

    res.json({ msg: "Product Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Couldn't Delete Product" });
  }
};


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