const Discord = require('discord.js');

module.exports = class {
  constructor() {
    this.name = 'message';
  }

  /**
   *
   *
   * @param {Discord.Message} message
   */
  async run(message) {
    if (message.staff) {
      const usr = message.content.match(/[0-9]{15,20}/);
      if (usr === null) {
        message.channel.send('❗ I could not find a valid user mention or id');
      } else {
        try {
          /** @type {Discord.User} */
          const dest = await global.Client.users.fetch(usr[0]);
          const dmChan = await dest.createDM();
          await dmChan.send(`[Staff message] ${message.content.split(' ').slice(1).join(' ').replace(usr[0], '')}\n\n_You cannot reply to this message. If this message is related to a report you made feel free to append information to your report by using the report command again._`, { split: true });
        } catch (error) {
          message.reply(`❗ I was unable to create a dm for this user (\`${error.message}\`)`);
        }
      }
    }
  }
};
