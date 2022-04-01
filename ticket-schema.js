const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    ticketNumber: Number,
})
module.exports = mongoose.model('Tickets', schema)