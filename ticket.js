const  { Client, Intents, MessageActionRow,  MessageButton, Permissions } = require("discord.js")
const Discord = require('discord.js')
const mongoose = require('mongoose')
const ticketSchema = require('./ticket-schema')
const suggestionSchema = require('./suggestion-schema')
const settingSchema = require('./settings-schema')
const transcriptSchema = require('./transcript-schema')
const fs = require('fs')
require('dotenv').config()
const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
    })

const prefix = '-'

client.commands = new Discord.Collection()
const commandFolders = fs.readdirSync('./cmds/')
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./cmds/${folder}`).filter(file => file.endsWith('.js'))

for(const file of commandFiles)
{
    const command = require(`./cmds/${folder}/${file}`)
    client.commands.set(command.name, command)
}
}


client.on('ready', async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        keepAlive: true
    })

    console.log('Bot started.')
    client.user.setActivity('mc.minepact.net', { type: 'PLAYING'})
    /*await new settingSchema({
        settingsCall: 'on',
        suggestionsToggled: 'on',
        ticketsToggled: 'on',
        applicationsToggled: 'on',
    }).save()*/
})
let idSupport = '957836172720238632' //'957874111269441597' '957836172720238632' // Server 1
let ticketsID = '957911835900792832' //'957911835900792832' "947068515440021524"
client.on('messageCreate', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return
    
    const args = message.content.substring(prefix.length).split(" ")
    const command = args.shift().toLowerCase()
    if(command === 'ping')
    {
        client.commands.get('ping').execute(message, args)
    }
    if(command === 'setup' && message.member.roles.cache.has('947029503182512148'))
    {
        const setup = await message.guild.channels.create('Support', {
            type: 'GUILD_CATEGORY',
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone,
                    allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                    deny: ['SEND_MESSAGES'],
                }
            ]
        })
        const tickets = await message.guild.channels.create('create a ticket', {
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone,
                    allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                    deny: ['SEND_MESSAGES'],
                }
            ]
        })
        tickets.setParent(setup.id)
        message.client.channels.cache.get(tickets.id).send({embeds: [createTicket], components: [row] })
        message.react('✔')
    }
    if(command === 'rename' || command === 'r' && message.channel.parent.id === '957911835900792832')
    {
        client.commands.get('rename').execute(message, args)
    }
    if(command === 'close' || command === 'c' && message.channel.parent.id === ticketsID)
    {
        client.commands.get('close').execute({message, args, client, transcriptSchema, closingTicket, cantClose})
    }
    if(command === 'suggest')
    {
        client.commands.get('suggest').execute(message, args, suggestionSchema, settingSchema)
    }
    if(command === 'accept')
    {
        client.commands.get('accept').execute(message, args, suggestionSchema)
    }
    if(command === 'deny')
    {
        client.commands.get('deny').execute(message, args, suggestionSchema)
    }
    if(command === 'toggle' || command === 't')
    {
        client.commands.get('toggle').execute(message, args, settingSchema)
    }
    if(command === 'newchan' && message.member.roles.cache.has('947029503182512148'))
    {
        message.channel.send({embeds: [createTicket], components: [row]})
    }
    if(command === 'toggles' || command === 'ts')
    {
        client.commands.get('toggles').execute(message, args, settingSchema)
    }
    /*if(command === 'verifycreate')
    {
        client.commands.get('verifycreate').execute(message, args, client)
    }*/
})
client.on('interactionCreate', async interaction => { // Ticket creation interaction
    if (!interaction.isButton()) return
    let { ticketNumber } = await ticketSchema.findOne({}).select('ticketNumber -_id')
    //console.log(ticketNumber)
    if (interaction.customId === 'ticketcreate') 
            {
                let { ticketsToggled } = await settingSchema.findOne({
                    settingsCall: 'on'
                }).select('ticketsToggled suggestionsToggled applicationsToggled -_id')
                if(ticketsToggled === 'Disabled')
                {
                    interaction.reply({content: 'Tickets are currently disabled!', ephemeral: true})
                    return
                }
                let supportID = interaction.guild.roles.cache.get(idSupport)
                const ticketCreation = await interaction.guild.channels.create('ticket ' + ticketNumber, { //Create ticket channel
                    type: 'GUILD_TEXT',
                    parent: ticketsID,
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                        },
                        {
                            id: supportID,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                        },
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY]
                        }
                    ],
                })
                //ticketCreation.setParent(ticketsID)
                interaction.client.channels.cache.get(ticketCreation.id).send({embeds: [ticketMessage], components: [closeTicket] })
                interaction.deferUpdate()
                await ticketSchema.findOneAndUpdate(
                    {
                        $inc: {
                            ticketNumber: 1
                        }
                    }
                )
            }
    if (interaction.customId === 'ticketclose')
    {
        if(!interaction.member.roles.cache.find(r => r.name === 'Support'/*!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES*/))
        {
            interaction.channel.send({embeds: [cantClose]})
            interaction.deferUpdate()
            return
            
        }
        else
        interaction.channel.send({embeds: [closingTicket]})
        setTimeout(() => interaction.channel.delete(), 5000)
        interaction.deferUpdate()
    }
    
})
client.on('interactionCreate', async interaction => {
    memberRoleID = '947023290478788608'
    member = interaction.member
    if (!interaction.isButton()) return
    if (interaction.customId === 'verify'){
        interaction.guild.roles.fetch(memberRoleID)
        .then(role => member.roles.add(role))
        interaction.deferUpdate()
    }
 })



// Everything below here is embeds.
const ticketMessage = {
    color: 0x00ff80,
    title: 'Support Ticket',
    description: 'Thank you for contacting MinePact Support.\ Help will be with you shortly.',
    fields: [
        {
            name: '\u200b',
            value: `Please answer the following questions.\n\`\`\`- What is your in-game username?\n- What can we help you with?\`\`\``
        },
    ],
    footer: {
        text: 'Please wait patiently while we assist you.',
    }
}
const createTicket = {
    color: 0x00ff80,
    title: 'MinePact Support Tickets',
    description: 'Are you looking for help? Create a support ticket! \ Support tickets are a great place for you to get help with any issues you are experiencing on our server.',
    fields: [
        {
            name: '\u200b',
            value: 'Please be patient as our staff try to assist you as soon as possible.'
        },
        {
            name: 'CLICK THE BUTTON BELOW TO GET SUPPORT.',
            value: '\u200b'
        }
    ]
}
const closingTicket = {
    color: 0x00ff80,
    description: 'Ticket closing in 5 seconds!'
}
const cantClose = {
    color: 0x00ff80,
    description: 'You cannot close this ticket!'
}
const row = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('ticketcreate')
        .setLabel('Create Ticket')
        .setStyle('PRIMARY')
)
const closeTicket = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('ticketclose')
        .setLabel('❌ Close Ticket')
        .setStyle('DANGER')
)

client.login(process.env.TOKEN)
