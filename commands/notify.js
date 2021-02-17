const AltairGuilds = require('../src/js/guilds');

module.exports = class {
  constructor() {
    this.name = 'notify';
  }

  async run(message) {
    if (message.staff) {
      const currentGuilds = new AltairGuilds();
      await currentGuilds.fetchGuilds();
      const notifyEmbed = new (require('../src/js/defaultEmbed'))('Staff message', { name: message.author.username, iconURL: message.author.displayAvatarURL() });
      notifyEmbed.setDescription(message.content.split(' ').slice(1).join(' '));
      currentGuilds.notify(notifyEmbed);
      message.react('✅');
    } else {
      message.channel.send('🔐 You cannot use this command');
    }
  }
};
