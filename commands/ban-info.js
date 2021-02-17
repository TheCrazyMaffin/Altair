// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const AltairBan = require('../src/js/ban');
const DefaultEmbed = require('../src/js/defaultEmbed');

module.exports = class {
  constructor() {
    this.name = 'info';
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
        const b = new AltairBan(usr);
        await b.fetch();
        if (!b.exists) {
          message.channel.send('✅ This user is not banned.');
        } else {
          const emb = new DefaultEmbed('Ban lookup', { name: b.user.username, iconURL: b.user.displayAvatarURL() });
          emb.addField('Banned by', `${b.moderator.tag} (${b.moderator.id})`);
          emb.addField('Reason', b.reason || 'No reason set');
          emb.setFooter('Additional info may be added at any point');
          message.channel.send(emb);
        }
      }
    } else {
      message.channel.send('🔐 You cannot use this command. This command requires the `BAN_MEMBERS` permission.');
    }
  }
};
