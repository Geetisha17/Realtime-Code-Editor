const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
    userId: {
        type:String,
        required: true,
        ref: 'User'
    },
    code:{
        type:String,
        required: true,
    },
    timestamp:{
        type:Date,
        default: Date.now
    },
    updatedAt:{
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Code' , codeSchema);