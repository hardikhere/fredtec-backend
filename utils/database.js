require("dotenv").config();
const mongoose = require("mongoose");

function connect_db(){
    try{
        mongoose.connect("mongodb+srv://hardik:fredmathardik@cluster0.i6hez.mongodb.net/fredmat?retryWrites=true&w=majority",
        { useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex:true,
          useFindAndModify: false
        })
        .then(()=>{
              console.log("db connected");
        });
    }
    catch(err){
             console.log("db not connected",err);
        }; 
}

module.exports = connect_db;