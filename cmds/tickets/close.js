const { MessageAttachment } = require('discord.js')
const discordTranscripts = require('discord-html-transcripts')

module.exports = {
    name: 'close',
    description: 'closes a ticket',
    async execute({message, args, client, closingTicket, cantClose }){
        if(!message.member.roles.cache.find(r => r.name === 'Support'/*!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES*/))
        {
            message.channel.send({embeds: [cantClose]})
            return
        }
        else
        message.channel.send({embeds: [closingTicket]})
        setTimeout(() => message.channel.delete(), 5000)
    }
}