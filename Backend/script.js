
const axios = require('axios').default;
const qs = require('qs');
const fs = require('fs');
const path = require('path');
const sendWebhook = require('./Utils/webhook.js');

async function postLogin(theContent) {
    try {
        const response = await axios({
            method: 'POST',
            url: 'RETRACTED',
            headers: {
                "Host": "RETRACTED",
                "Cookie": "src=web;",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:102.0) Gecko/20100101 Firefox/102.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Origin": "RETRACTED",
                "Referer": "RETRACTED",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Dnt": 1,
                "Te": "trailers",
            },
            data: qs.stringify({
                username: theContent.email,
                password: theContent.password,
            }),
            timeout: 20000
        })

        if (response.data.error == "Username and/or Password was incorrect") {
            console.log('Error: Invalid Credentials');
            sendWebhook.sendEmbeded(theContent, "true", "Username and/or Password was incorrect");
        } else if (response.data.tokenID) {
            const tokenID = response.data.tokenID;
            setInHouse(tokenID, theContent);
        } else {
            console.log('Error: Unknown Error');
            sendWebhook.sendEmbeded(theContent, "true", "Unknown Error");
        }

    } catch (err) {
        console.log(err);
        sendWebhook.sendEmbeded(theContent, "true", "Server Error (Try/Catch)");
    }

}

async function setInHouse(tokenID, theContent) {
  try {
    const response = await axios({
        method: 'POST',
        url: 'RETRACTED',
        headers: {
          "Host": "RETRACTED",
          "Cookie": `src=web; authToken=${tokenID}`,
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:102.0) Gecko/20100101 Firefox/102.0",
          "Accept": "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Content-Length": "108",
          "Origin": "RETRACTED,
          "Referer": "RETRACTED",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "Dnt": "1",
          "Te": "trailers",
        },
        data: {
          "locID": 24,
          "cid": 9703,
          "reqID": null,
          "c": -1,
          "sd": "",
          "sdcid": 0,
          "authToken": tokenID
        },
        timeout: 20000
    })

    if(response.data.done ==  1) {
      console.log("Successfully In House!");
      sendWebhook.sendEmbeded(theContent, "false", "success");
    } else {
      sendWebhook.sendEmbeded(theContent, "true", "Error Submitting SISO");
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
    sendWebhook.sendEmbeded(theContent, "true", "Server Error (Try/Catch)");
  } 

} 

module.exports = { postLogin }
