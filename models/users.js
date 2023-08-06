const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { use } = require('../routes/users');
const Schema = mongoose.Schema;

const userModel = new Schema({
    displayName:{
        type:String
    },
    email:{
        type: String,
        required: true,
        unique : true
    },
    password:{
        type:String,
        required: true
    },
    age:{
        type: Number,
        default: 0
    },
    userType:{
        type: String,
        enum : ['talent', 'cd', 'admin'],
        default : 'talent'
    }
})

userModel.pre('save', async function (next){
    this.email = this.email.toLowerCase()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

module.exports = mongoose.model('User',userModel)