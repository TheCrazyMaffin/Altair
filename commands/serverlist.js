// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const AltairGuilds = require('../src/js/guilds');

module.exports = class {
  constructor() {
    this.name = 'serverlist';
  }

  /**
   *
   * @param {Discord.Message} message
   */
  async run(message) {
    if (message.staff) {
      const guilds = await (new AltairGuilds()).fetchGuilds();
      let txt = '**Name | Autobans | Logging**\n';
      for (const guild of guilds.guilds) {
        if (!guild.available) return;
        txt += `${guild.name} | ${guild.autobans === 1 ? '✅' : '❌'} | ${guild.logging === null ? 'Disabled' : `<#${guild.logging.id}>`}\n`;
      }
      message.channel.send(txt, { split: true });
    } else {
      message.channel.send('🔐 You cannot use this command');
    }
  }
};
