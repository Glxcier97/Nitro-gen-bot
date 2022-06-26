const express = require ("express");
const app = express();
const prefix = "!";
const requests = require('requests');
const token = process.env['token']
const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const status = "Free Nitro"
var messages = []
var stopgen = false
var gen = false

app.listen(3000, () => {

    console.log("Bot is working!");

})

app.get("/", (req, res) => {

    res.send("Bot is ready!");

})

const Discord = require ("discord.js");
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

client.once("ready", () => {

    client.user.setActivity(
        
        `${status}`,
        { type : 'PLAYING' },

    )

});

client.on("messageCreate", message => {

    if (message.content.includes(`${prefix}gen`)) {

      var messageNumberContent = message.content.replace(`${prefix}gen`, ``)

      if (messageNumberContent != ``) {

        if (message.author.id != "988680006177812491") {
            
          SendCodes(messageNumberContent, message);
          
        }

      } else {

        message.channel.send(`${message.author} Type the amount of codes! (!gen <number>)`)
        
      }

    }

})

function SendCodes(amount, message) {

  message.channel.send(`${message.author} Check the new text channel!`)
        
  message.guild.channels.create('generator', {
  	type: 'text',
    permissionOverwrites: [
    {
              
      id: message.guild.id,
      deny: ['VIEW_CHANNEL'],
              
  	},
    {
  
      id: message.author.id,
      allow: ['VIEW_CHANNEL']
              
    }
    ]
  }).then(result => {
  
    const id = result.id

    client.channels.cache.get(id).send(`${message.author} Generating your codes please wait... its may take some time based on the amount of codes`);
    
    for (let i = 0; i < amount; i++) {

      code = "";

      for (let i = 0; i < 16; i++) {

        code += chars.charAt(Math.floor(Math.random() * chars.length));
        
      }

      const messageCode = "https://discord.gift/" + code;

      const url = "https://discordapp.com/api/v9/entitlements/gift-codes/" + messageCode + "?with_application=false&with_subscription_plan=true"
      const url2 = "https://discordapp.com/api/v9/entitlements/gift-codes/" + code + "?with_application=false&with_subscription_plan=true"

      const response = requests(url);
      const response2 = requests(url2);
      
      if (response.status_code != 200 && response2.status_code != 200) {

        client.channels.cache.get(id).send("Invailed...");
        
      } else {

        client.channels.cache.get(id).send(messageCode);
        
      }

      if (i == amount - 1) {

        client.channels.cache.get(id).send(`${message.author} Click on the reaction to remove this channel (if you won't click on this after more than 24 hourse you may get banned!)`)
          .then(function (message){
            
            message.react('✅')
            
          });
        
      }
            
    }
          
  });
  
}

console.log(`Bot token: ${token}`)

client.login(`${token}`)
