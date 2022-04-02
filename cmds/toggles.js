const { Permissions } = require('discord.js')

module.exports = {
    name: 'toggles',
    description: 'shows current settings',
    async execute(message, args, settingSchema){
        if(!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
        {
            message.channel.send('You do not have permission to run this command!')
            return
        }
        let { ticketsToggled, suggestionsToggled, applicationsToggled } = await settingSchema.findOne({
            settingsCall: 'on'
        }).select('ticketsToggled suggestionsToggled applicationsToggled -_id')
        const settingStatus = {
            color: 0x00ff80,
            title: 'Settings',
            description: 'Current status of all settings.',
            fields: [
                {
                    name: 'Suggestions:',
                    value: suggestionsToggled,
                },
                {
                    name: 'Tickets:',
                    value: ticketsToggled,
                },
                {
                    name: 'Applications:',
                    value: applicationsToggled,
                }
            ],
        }
        message.channel.send({embeds: [settingStatus]})
    }
}