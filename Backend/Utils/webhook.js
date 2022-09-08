const {
    Webhook,
    MessageBuilder
} = require('discord-webhook-node');
const fs = require('fs');
const path = require('path')
const restartCron = require('../cron.js');

const sendEmbeded = (theContent, error, message) => {

    if(error == "true") {

        const hook = new Webhook("RETRACTED");

        hook.setUsername('ReachAIO V2');
        hook.setAvatar('https://i.ibb.co/0JbfbHD/Screen-Shot-2022-08-08-at-11-28-10-PM.png');

        const embed = new MessageBuilder()
            .setTitle('😡 ReachAIO Error 😡')
            .addField('User', theContent.email)
            .addField('Code', message, true)
            .addField('Fatal', 'True')
            .setColor('#00b0f4')
            .setFooter('ReachAIO V2', 'https://i.ibb.co/0JbfbHD/Screen-Shot-2022-08-08-at-11-28-10-PM.png')
            .setTimestamp();

        hook.send(embed);

    } else {

        const hook = new Webhook("RETRACTED");

        hook.setUsername('ReachAIO V2');
        hook.setAvatar('https://i.ibb.co/0JbfbHD/Screen-Shot-2022-08-08-at-11-28-10-PM.png');
  
        const embed = new MessageBuilder()
            .setTitle('🎉 ReachAIO Success 🎉')
            .addField('User', theContent.email)
            .addField('Message', 'Successful Siso', true)
            .addField('Error', 'False')
            .setColor('#00b0f4')
            .setFooter('ReachAIO V2', 'https://i.ibb.co/0JbfbHD/Screen-Shot-2022-08-08-at-11-28-10-PM.png')
            .setTimestamp();
  
        hook.send(embed);

    }

}

module.exports = { sendEmbeded }
