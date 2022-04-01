const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    Channel: String,
    Content: String,
})
module.exports = mongoose.model('transcript', schema)