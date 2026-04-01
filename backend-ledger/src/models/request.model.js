const mongoose=require("mongoose");

const requestSchema=new mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    to:{ //user id 2nd one in mongoDB
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{
        type: Number,
        required:true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
},{
    timestamps:true
})

module.exports=mongoose.model("request",requestSchema)