const schedule = require('node-schedule');
const { postLogin } = require('./script.js');
const path = require('path')

async function runCronLoop(theContent) {
    console.log(theContent)

    const time = theContent.time;

    const hour = time.charAt(0) + time.charAt(1);
    const minute = time.charAt(3) + time.charAt(4);

    schedule.scheduleJob(`00 ${minute} ${hour} * * *`, function(){
        console.log('Starting task...');
        postLogin(theContent);
    });

}

module.exports = { runCronLoop }