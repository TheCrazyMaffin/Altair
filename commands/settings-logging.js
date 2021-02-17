const sqlite = require('sqlite3');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

const Database = new sqlite.Database(path.join(process.cwd(), 'database/main.db'));

module.exports = class {
  constructor() {
    this.name = 'logging';
  }

  /**
   *
   * @param {Discord.Message} message
   */
  async run(message) {
    if (typeof message.member !== 'undefined' && typeof message.guild !== 'undefined' && message.member.hasPermission('BAN_MEMBERS')) {
      const channel = message.content.match(/[0-9]{15,20}/);
      if (channel === null) {
        if (message.content.includes('none')) {
          Database.run('UPDATE guilds SET logging=NULL WHERE id=?', [message.guild.id], (err) => {
            if (err !== null) {
              throw err;
            } else {
              message.channel.send('📑 Logging channel removed. You will not receive notifications anymore.');
            }
          });
        } else {
          message.channel.send('❗ I could not find a valid channel mention or ID');
        }
      } else if (!message.guild.channels.cache.has(channel[0])) {
        message.channel.send('❗ You can only use channels which are in this guild');
      } else {
        Database.run('UPDATE guilds SET logging=? WHERE id=?', [channel[0], message.guild.id], (err) => {
          if (err !== null) {
            throw err;
          } else {
            message.channel.send(`📑 Logging channel set to <#${channel[0]}>`);
          }
        });
      }
    } else {
      message.channel.send('🔐 You cannot use this command. This command requires the `BAN_MEMBERS` permission.');
    }
  }
};
