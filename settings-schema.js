const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    settingsCall: String,
    ticketsToggled: String,
    suggestionsToggled: String,
    applicationsToggled: String,
})
module.exports = mongoose.model('Setting', schema)