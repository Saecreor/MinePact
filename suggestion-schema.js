const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    suggestionID: Number,
    creatorID: String,
    creatorUsername: String,
    creatorAvatar: String,
    messageID: String,
    suggestionMessage: String,
    upVote: String,
    downVote: String,
    //suggestionStatus: String,
})
module.exports = mongoose.model('Suggestion', schema)