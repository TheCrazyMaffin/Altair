module.exports = class {
  constructor() {
    this.name = 'migrating';
  }

  async run(message) {
    if (message.staff) {
      for (const guild of global.Client.guilds.cache.array()) {
        guild.channels.cache.find((ch) => ch.name.includes('altair')).send('We are performing some updates to improve altair. Your autoban settings have been saved but you may set a custom logging channel now. If youd wish to keep the current channel please execute `+logging #altair`. To find out more contact us on the support server or type `+help`');
      }
      message.react('✅');
    } else {
      message.channel.send('🔐 You cannot use this command');
    }
  }
};
