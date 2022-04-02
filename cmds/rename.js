module.exports = {
    name: 'rename',
    description: 'renames a ticket',
    execute(message, args){
        if(!message.member.roles.cache.find(r => r.name === 'Support'))
        {
            message.channel.send("You can't rename this ticket")
            return
        }
        else
        if(!args[0])
        {
            message.channel.send('Please specify a name!')
        }
        const name = args.join(' ')
        const renameTicket = {
            color: 0x00ff80,
            description: 'Ticket has been renamed to ' + name
        }
        message.channel.setName(name)
        message.channel.send({embeds: [renameTicket]})
    }
}