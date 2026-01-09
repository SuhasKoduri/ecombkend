const um = require("../Models/usermod")
let bcrypt=require("bcrypt")
let jwt = require("jsonwebtoken")
let reg=async(req,res)=>{
    try{
        let obj=await um.findById(req.body._id)
        if(obj){
         res.json({"msg":"User Exists Please Login"})   
        }
        else{
            let hashpwd=await bcrypt.hash(req.body.pwd,process.env.rot)
            let data=new um(req.body)
            data.pwd=hashpwd
            if(req.body.role=="emp")
            {
                data.status="accepted"
            }
            await data.save()
            res.json({"msg":"User Registration Successful"}) 
        }
    }
    catch(err){
        res.json({"msg":"Couldn't Register Please Try Again"})
        console.log(err);
        
    }
}

let login=async(req,res)=>{
    try{
        let obj=await um.findById(req.body._id)
        if(obj){
            let vpwd=await bcrypt.compare(req.body.pwd,obj.pwd)
            if(vpwd && obj.status=="accepted")
            {
                res.json({"token":jwt.sign({"_id":req.body._id},process.env.secpwd),"_id":obj._id,"role":obj.role,"name":obj.name})
            }
            else{
                if(obj.status!="accepted")
                    res.json({"msg":"Admin Yet To Accept Your Request"})
                res.json({"msg":"Check Your Password"})
            }
        }
        else{
            res.json({"msg":"Check Your Email_ID"})
        }
    }
   catch(err){
        res.json({"msg":"Couldn't Login Please Try Again"})
        console.log(err);
        
    } 
}


let penemp=async(req,res)=>{
    try{
        let data=await um.find({"status":"pending"})
        res.json(data)
    }
    catch(err){
        console.log(err);
        
    }
}

let updst=async(req,res)=>{
    try{
        if(req.body.status=="accepted")
        {
           await um.findByIdAndUpdate({"_id":req.body._id},{"status":"accepted"})
        }
        else{
           await um.findByIdAndDelete({"_id":req.body._id})
        }
        res.json({"msg":"User Updated"})
    }
    catch(err){
        console.log(err);
        
    }
}
module.exports={reg,login,penemp,updst}