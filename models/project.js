const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    cdName: String,
    title: {
        type:String,
        require: true
    },
    description: {
        type:String,
        required: true
    }
})

module.exports = mongoose.model('Project', projectSchema)