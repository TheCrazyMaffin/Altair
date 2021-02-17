require('dotenv').config();
const Discord = require('discord.js');

global.Client = new Discord.Client();
const fs = require('fs');
const util = require('util');

fs.readdir = util.promisify(fs.readdir);

async function init() {
  console.log('[Note] Starting to load assets');
  global.Client.commands = new Map();

  // Read and register events
  const evFiles = await fs.readdir('./events');
  evFiles.forEach((file) => {
    const event = new (require(`./events/${file.replace('.js', '')}`))();
    if (typeof event.name !== 'string') {
      console.error(`[Error] "${file}" does not provide a correct event name. Did not register this event`);
    } else if (typeof event.run !== 'function') {
      console.error(`[Error] "${file}" does not provide a correct "run" function. Did not register this event`);
    } else {
      global.Client.on(event.name, event.run);
    }
  });

  const cmdFiles = await fs.readdir('./commands');
  cmdFiles.forEach((file) => {
    const command = new (require(`./commands/${file.replace('.js', '')}`))();
    if (typeof command.name !== 'string') {
      console.error(`[Error] "${file}" does not provide a correct command name. Did not register this command`);
    } else if (typeof command.run !== 'function') {
      console.error(`[Error] "${file}" does not provide a correct "run" function. Did not register this command`);
    } else {
      global.Client.commands.set(command.name, command.run);
    }
  });

  global.Client.login(process.env.DISCORD_TOKEN);
}

init();
