let cm = require("../Models/cartmod")

let addcart=async(req,res)=>{
    try{
        
        let obj=await cm.findOne({"pid":req.body.pid,"uid":req.body.uid})
        if(obj)
        {
            await cm.findByIdAndUpdate({"_id":obj._id},{$inc:{"qty":1}})
        }
        else{
            let data=new cm({...req.body,"qty":1})
            await data.save()
        }
    }
    catch(err){
        console.log(err)
    }
}

let getcart=async(req,res)=>{
try{
    let data=await cm.find({"uid":req.params.uid})
    res.json(data)
}
catch(err){
    console.log(err);
    
}
}


let inc=async(req,res)=>{
    try{
        await cm.findByIdAndUpdate({"_id":req.params._id},{$inc:{"qty":1}})
        res.json({"msg":"Incrementd"})
    }
    catch(err){
        console.log(err);
    }
}


let dec=async(req,res)=>{
    try{
        let obj=await cm.findById({"_id":req.params._id})
        if(obj.qty>1)
        {
        await cm.findByIdAndUpdate({"_id":req.params._id},{$inc:{"qty":-1}})
        }
        else{
            await cm.findByIdAndDelete({"_id":req.params._id})
        }
        res.json({"msg":"Decremented"})
    }
    catch(err){
        console.log(err);
    }
}
module.exports={addcart,getcart,inc,dec}