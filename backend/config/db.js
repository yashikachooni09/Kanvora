const mongoose = require("mongoose")

const connectDB = async()=>
{
    try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB Connected!")
    }
    catch(err)
    {
        console.error("Errror while connecting to DB:",err.message);

    }
}

module.exports = connectDB;