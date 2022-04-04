const { MessageReaction, MessageActionRow, MessageButton, Permissions } = require("discord.js")

module.exports = {
    name: 'verifycreate',
    description: 'creates the verify embed',
    async execute(message, args, client, interaction){
        if(!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
        {
            message.channel.send('You do not have permission to run this command!')
            return
        }
        if(message.member.roles.cache.find(r => r.name === 'Support'))
        {
            memberRoleID = '958829558117830676'

            const verifyEmbed = {
                color: 0x00ff80,
                title: 'Verify',
                description: 'Join the MinePact Official Discord by clicking verify below!',
            }
            const verifyButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('verify')
                    .setLabel('Verify')
                    .setStyle('SUCCESS')
            )

        message.channel.send({embeds: [verifyEmbed], components: [verifyButton]})
            
        }
    }
}