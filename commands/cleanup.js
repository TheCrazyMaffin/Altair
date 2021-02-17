const sqlite = require('sqlite3');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

const Database = new sqlite.Database(path.join(process.cwd(), 'database/main.db'));

module.exports = class {
  constructor() {
    this.name = 'cleanup';
  }

  /**
   *
   * @param {Discord.Message} message
   */
  async run(message) {
    if (typeof message.member !== 'undefined' && typeof message.guild !== 'undefined' && message.member.hasPermission('BAN_MEMBERS')) {
      Database.all('SELECT * FROM bans', async (err, rows) => {
        if (err !== null) {
          throw err;
        } else if (typeof rows === 'undefined') {
          message.channel.send('✅ No one to ban');
        } else if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
          message.channel.send('❗ I do not have the ban members permission');
        } else {
          const mes = message.channel.send(`Banning ${rows.length} members`);
          let i = 0;
          for (const row of rows) {
            try {
              await message.guild.members.ban(row.id, { reason: `Cleanup command | ${message.author.tag}` });
              i += 1;
            } catch (error) {
              message.channel.send(`❗ Could not ban ${row.id}`);
            }
          }
          (await mes).edit(`${(await mes).content}\n${i} users were banned.`);
        }
      });
    } else {
      message.channel.send('🔐 You cannot use this command. This command requires the `BAN_MEMBERS` permission.');
    }
  }
};
