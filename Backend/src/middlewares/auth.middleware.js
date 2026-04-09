const jwt=require('jsonwebtoken')
const tokenBlacklistModel= require('../models/blacklist.model');

async function authUser(req,res,next){
     const token=req.cookies.token;
     if(!token){
            return res.status(401).json({message:"Token not found"})
     }

     const isTokenBlackListed=await tokenBlacklistModel.findOne({token
     })

     if(isTokenBlackListed){
            return res.status(401).json({message:"Token is invalid"})
     }

     try{ 
     const decoded= jwt.verify(token,process.env.JWT_SECRET)
     
     req.user = {
     _id: decoded._idid
     };
     
     next();

     } catch(err){
     return res.status(401).json({message:"Invalid Token"})
     }
}

module.exports= {authUser};