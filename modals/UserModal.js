
const mongoose = require('mongoose') ; 

const UserSchema = mongoose.Schema({
        username : {
            type : String , 
            trim : true , 
            required : true 
        },
        email : {
            type : String , 
            trim : true , 
            required : true , 
            unique : true 
        }
        , password : {
            type : String , 
            trim : true , 
            required : true 
        },
        role : {
            type : String , 
            default :"customer",
            enum : ["admin" , "customer"]
        },
        time : {
            type : String , 
            default : "0" 
        },
        flexboxPuzzle : {
            type : String , 
            default : "0" 
        },
        mathPuzzle : {
            type : String , 
            default : "0" 
        },
        mirrorPuzzle : {
            type : String , 
            default : "0" 
        },
        puzzlerModalPuzzle : {
            type : String , 
            default : "0" 
        },
        recurrsionPuzzle : {
            type : String , 
            default : "0" 
        }
}) ; 

module.exports = mongoose.model("user" , UserSchema) ; 