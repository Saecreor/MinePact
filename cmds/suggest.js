module.exports = {
    name: 'suggest',
    description: 'creates a suggestion',
    async execute(message, args, suggestionSchema, settingSchema){
        if(!args[0])
        {
            message.channel.send('Please specify a suggestion!')
            return
        }
        let { suggestionsToggled } = await settingSchema.findOne({}).select('ticketsToggled suggestionsToggled applicationsToggled -_id')
        if(suggestionsToggled === 'Disabled')
        {
            message.reply('Suggestions are currently disabled!')
            return
        }
        const suggestion = args.join(' ')
        const pendingSuggestion = {
            color: 0x00ff80,
            title: 'New Suggestion',
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL(),
            },
            description: suggestion
        }
        let idSuggestion = await message.client.channels.cache.get('947038692197945394').send({embeds: [pendingSuggestion]})
        idSuggestion.react('958477145183772732')
        idSuggestion.react('958477114879926272')
        await new suggestionSchema({
            creatorUsername: message.author.username,
            creatorID: message.author.id,
            creatorAvatar: message.author.avatarURL(),
            messageID: idSuggestion.id,
            suggestionMessage: suggestion,
            suggestionStatus: 'pending',
        }).save()
    }
}