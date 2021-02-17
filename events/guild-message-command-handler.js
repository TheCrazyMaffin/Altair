const crypto = require('crypto');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

module.exports = class {
  constructor() {
    this.name = 'message';
  }

  /**
   * The run function for this command
   * @param {Discord.Message} message A message
   */
  async run(message) {
    if (message.type === 'DEFAULT' && typeof message.guild === 'object' && message.content.startsWith(process.env.PREFIX)) {
      const command = message.content.slice(process.env.PREFIX.length).split(' ')[0];
      try {
        const supportserverMember = await global.Client.guilds.cache.get(process.env.SUPPORT_SERVER).members.fetch(message.author.id);
        if (supportserverMember.roles.cache.has(process.env.STAFF_ROLE)) {
          message.staff = true;
        } else {
          message.staff = false;
        }
      } catch (error) {
        message.staff = false;
      }
      try {
        if (global.Client.commands.has(command)) {
          await global.Client.commands.get(command)(message);
        }
      } catch (error) {
        const referer = crypto.randomBytes(5).toString('hex');
        message.channel.send(`It appears that an error occured when trying to execute this command. This has been reported. ID: \`${referer}\`\n\`${error.message}\``);
        const errEmbed = new (require('../src/js/defaultEmbed'))(`Error - ${referer}`, { name: message.author.username, iconURL: message.author.displayAvatarURL() }, 'red');
        errEmbed.setURL(message.url);
        errEmbed.addField('Message content', `\`\`\`\n${message.content.replace('`', '\\`')}\n\`\`\``);
        errEmbed.addField('Error', `\`\`\`\n${error.stack.slice(0, 1000)}\n\`\`\``);
        errEmbed.addField('Link to command', `[Link](${message.url})`);
        global.Client.channels.cache.get(process.env.LOGGING_CHANNEL).send('', errEmbed);
      }
    }
  }
};
