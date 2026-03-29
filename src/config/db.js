const mongoose = require("mongoose")

function connectToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("server connected to db")
    })
    .catch(err =>{
        console.log("error in connection with db")
        process.exit(1)
    })
}

module.exports = connectToDb