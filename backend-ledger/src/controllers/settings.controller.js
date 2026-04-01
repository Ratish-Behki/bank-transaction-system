const User = require("../models/user.model");
const bcrypt = require("bcryptjs");


// UPDATE SETTINGS

exports.updateSettingsController = async (req,res)=>{

 try{

   const userId = req.user.id;

   const { name,email,currency,notifications } = req.body;

   const user = await User.findByIdAndUpdate(

     userId,

     {
       name,
       email,
       currency,
       notifications
     },

     {
       new:true,
       runValidators:true
     }

   ).select("-password"); // hide password


   res.status(200).json({

     success:true,
     message:"Settings updated successfully",
     user

   });

 }

 catch(err){

   res.status(500).json({

     success:false,
     message:err.message

   });

 }

};



// CHANGE PASSWORD

exports.changePasswordController = async (req,res)=>{

 try{

   const userId = req.user.id;

   const { currentPassword,newPassword } = req.body;

   if(!currentPassword || !newPassword){

     return res.status(400).json({

       success:false,
       message:"Both passwords required"

     });

   }

   const user = await User.findById(userId).select("+password");

   const match = await bcrypt.compare(

     currentPassword,

     user.password

   );

   if(!match){

     return res.status(400).json({

       success:false,
       message:"Current password incorrect"

     });

   }


   // DO NOT HASH HERE

   user.password = newPassword;

   await user.save();   // model will hash automatically


   res.status(200).json({

     success:true,
     message:"Password changed successfully"

   });

 }

 catch(err){

   res.status(500).json({

     success:false,
     message:err.message

   });

 }

};



// DELETE ACCOUNT

exports.deleteAccountController = async (req,res)=>{

 try{

   await User.findByIdAndDelete(req.user.id);

   res.status(200).json({

     success:true,
     message:"Account deleted successfully"

   });

 }

 catch(err){

   res.status(500).json({

     success:false,
     message:err.message

   });

 }

};