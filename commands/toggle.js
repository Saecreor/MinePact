module.exports = {
    name: 'toggle',
    description: 'toggles settings',
    async execute(message, args, settingSchema){
        if(!args[0])
        {
            message.channel.send('Incorrect command usage. Please use -toggle (suggestions/tickets/applications)')
            return 
        }
        if(!message.member.roles.cache.has('947029503182512148'))
        {
            message.channel.send('You do not have permission to run this command!')
            return
        }
        const whatToggle = args.join(' ')
        let { ticketsToggled, suggestionsToggled, applicationsToggled } = await settingSchema.findOne({
            settingsCall: 'on'
        }).select('ticketsToggled suggestionsToggled applicationsToggled -_id')
       // console.log(ticketsToggled, suggestionsToggled, applicationsToggled)
        if(whatToggle === 'suggestions')
        {
            if(suggestionsToggled === 'Enabled')
            {
                await settingSchema.findOneAndUpdate({
                    suggestionsToggled: 'Disabled'
                })
                message.channel.send('Suggestions have been disabled.')
            }
            else
            {
                await settingSchema.findOneAndUpdate({
                    suggestionsToggled: 'Enabled'
                })
                message.channel.send('Suggestions have been enabled.')
            }
        }
        else if(whatToggle === 'tickets')
        {
           if(ticketsToggled === 'Enabled')
           {
            await settingSchema.findOneAndUpdate({
                ticketsToggled: 'Disabled'
            })
            message.channel.send('Tickets have been disabled.')
           }
           else
           {
            await settingSchema.findOneAndUpdate({
                ticketsToggled: 'Enabled'
            })
            message.channel.send('Tickets have been enabled.')
           }
        }
        else if(whatToggle === 'applications')
        {
            if(applicationsToggled === 'Enabled')
            {
                await settingSchema.findOneAndUpdate({
                    applicationsToggled: 'Disabled'
                })
                message.channel.send('Applications have been disabled.')
            }
            else
            {
                await settingSchema.findOneAndUpdate({
                    applicationsToggled: 'Enabled'
                })
                message.channel.send('Applications have been enabled.')
            }
        }
        else
        {
            message.channel.send('Incorrect command usage. Please use -toggle (suggestions/tickets/applications)')
        }
    }
}