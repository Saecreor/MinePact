module.exports = {
    name: 'deny',
    description: 'Denies a suggestion',
    async execute (message, args, suggestionSchema){
        if(!args[0])
        {
            message.channel.send('Please use a suggestion id!')
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
        const deniedSuggestion = {
            color: 0x00ff80,
            title: 'Denied Suggestion',
            author: {
                name: creatorUsername,
                icon_url: creatorAvatar,
            },
            description: suggestionMessage,
        }
        message.client.channels.cache.get('947038692197945394').messages.fetch(messageID).then(message => message.delete())
        message.client.channels.cache.get('947057389721485332').send({embeds: [deniedSuggestion]}).then(await suggestionSchema.deleteOne({
            messageID: suggestion,
        }) ) 
    }
}