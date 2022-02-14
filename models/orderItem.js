const mongoose=require('mongoose')
const { ObjectId}=mongoose.Schema

const oderItemSchema=new mongoose.Schema({
    quantity:{
        type:Number,
        required:true
    },
    product:{
        type:ObjectId,
        require:true,
        ref:'Product'
    }
},{timestamps:true})

module.exports=mongoose.model('OrderItem',oderItemSchema)