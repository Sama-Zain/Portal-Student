import mongoose from "mongoose";
const { Schema, SchemaTypes } = mongoose;
const tokenSchema = new mongoose.Schema({
    jti:{
        type:String,
        required:true,
        unique:true,
    },
    userId:{
        type:SchemaTypes.ObjectId,
        required:true,
        ref:"User",
    },
    expiresIn:{
        type:Date,
        required:true,
    },
},
  {
    timestamps:true,
    versionKey:false,
    collection:"Tokens"
});
tokenSchema.index("expiresIn",{expireAfterSeconds:0});
const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);
export default Token;