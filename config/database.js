const mongoose = require("mongoose");
require('dotenv').config() ; 


const URL = process.env.MONGO_URL ; 
const connectToDb = () => {
  mongoose
    .connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("connected to db"))
    .catch((error)=>{
      console.log("problem in connection to db" , error);
    });
};

module.exports = connectToDb;
