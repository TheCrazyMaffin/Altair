const sqlite = require('sqlite3');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

const Database = new sqlite.Database(path.join(process.cwd(), 'database/main.db'));

module.exports = class {
  constructor() {
    this.name = 'report';
  }

  /**
   *
   * @param {Discord.Message} message
   */
  async run(message) {
    if (typeof message.member !== 'undefined' && typeof message.guild !== 'undefined' && message.member.hasPermission('BAN_MEMBERS')) {
      const usr = message.content.match(/[0-9]{15,20}/);
      if (usr === null) {
        message.channel.send('❗ I could not find a valid user mention or id');
      } else {
        /** @type Discord.User */
        let user;
        try {
          user = await global.Client.users.fetch(usr[0]);
        } catch (error) {
          message.channel.send('❗ I could not find that user');
          return;
        }
        Database.get('SELECT * FROM reports WHERE userID=?', [user.id], async (err, row) => {
          const reportContent = `**${message.author.tag} (${message.author.id}):** ${message.content.split(' ').slice(2).join(' ')}${message.attachments.array().length === 0 ? '' : '\n**Attachments:**\n'}${message.attachments.array().map((at) => at.url).join('\n')}`;
          if (err !== null) {
            throw err;
          } else if (typeof row === 'undefined') {
            const channelOptions = {
              parent: process.env.REPORT_CATEGORY,
              permissionOverwrites: [
                {
                  id: process.env.SUPPORT_SERVER,
                  deny: 'VIEW_CHANNEL',
                },
                {
                  id: process.env.STAFF_ROLE,
                  allow: 'VIEW_CHANNEL',
                },
                {
                  id: global.Client.user.id,
                  /** @type Discord.PermissionFlags[] */
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
              ],
            };
            /** @type Discord.TextChannel */
            let reportChannel;
            try {
              reportChannel = await global.Client.guilds.cache.get(process.env.SUPPORT_SERVER).channels.create(user.username, channelOptions);
            } catch (error) {
              message.channel.send('❗ I am unable to create channels on the support server.');
              return;
            }
            try {
              await reportChannel.send(`User: <@!${user.id}> ${user.tag} (${user.id})`);
              reportChannel.send(reportContent, {
                split: true,
              });
              message.channel.send('✅ Your report has been sent.');
              Database.run('INSERT INTO reports (userId, channel) VALUES (?, ?)', [user.id, reportChannel.id]);
            } catch (error) {
              message.channel.send('❗ I am unable to send messages in the ticket channel.');
            }
          } else {
            const reportChannel = global.Client.channels.cache.get(row.channel);
            reportChannel.send(reportContent, {
              split: true,
            });
            message.channel.send('✅ Your report has been sent.');
          }
        });
      }
    } else {
      message.channel.send('🔐 You cannot use this command. This command requires the `BAN_MEMBERS` permission.');
    }
  }
};
