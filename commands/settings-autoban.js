const sqlite = require('sqlite3');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

const Database = new sqlite.Database(path.join(process.cwd(), 'database/main.db'));

module.exports = class {
  constructor() {
    this.name = 'autoban';
  }

  /**
   *
   * @param {Discord.Message} message
   */
  async run(message) {
    if (typeof message.member !== 'undefined' && typeof message.guild !== 'undefined' && message.member.hasPermission('BAN_MEMBERS')) {
      const val = message.content.split(' ')[1];
      if (['true', '1', 'yes'].includes(val)) {
        Database.run('UPDATE guilds SET autobans=1 WHERE id=?', [message.guild.id]);
        message.channel.send('🔨 Autobans enabled');
      } else {
        Database.run('UPDATE guilds SET autobans=0 WHERE id=?', [message.guild.id]);
        message.channel.send('🛑 Autobans disabled');
      }
    } else {
      message.channel.send('🔐 You cannot use this command. This command requires the `BAN_MEMBERS` permission.');
    }
  }
};
