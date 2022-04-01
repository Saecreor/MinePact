module.exports = {
    name: 'accept',
    description: 'accepts a suggestion',
    async execute(message, args, suggestionSchema){
        if (!args[0])
        {
            message.channel.send('Please use a suggetion id!')
            return
        }
        if(!message.member.roles.cache.has('947070311231270932')) // replace with suggestions role.
        {
            message.channel.send("You don't have permission")
            return
        }
        message.delete()
        const suggestion = args.join(' ')
        let { suggestionMessage, creatorUsername, creatorAvatar, messageID } = await suggestionSchema.findOne({
            messageID: suggestion
        }).select('suggestionMessage creatorUsername creatorAvatar messageID -_id')
        const acceptedSuggestion = {
            color: 0x00ff80,
            title: 'Accepted Suggestion',
            author: {
                name: creatorUsername,
                icon_url: creatorAvatar,
            },
            description: suggestionMessage,
        }
        message.client.channels.cache.get('947038692197945394').messages.fetch(messageID).then(message => message.delete()) // replace id with pending suggestions channel.
        message.client.channels.cache.get('957688192801312798').send({embeds: [acceptedSuggestion]}).then(await suggestionSchema.deleteOne({
            messageID: suggestion
        })) // Replace channel id with accepted suggestions channel.
    }
}