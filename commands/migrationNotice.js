module.exports = class {
  constructor() {
    this.name = 'migrating';
  }

  async run(message) {
    if (message.staff) {
      for (const guild of global.Client.guilds.cache.array()) {
        const altairChan = guild.channels.cache.find((ch) => ch.name.includes('altair'));
        if (typeof altairChan !== 'undefined') {
          altairChan.send('We are performing some updates to improve altair. Your autoban settings have been saved but you may set a custom logging channel now. If youd wish to keep the current channel please execute `+logging #altair`. To find out more contact us on the support server or type `+help`');
        } else {
          message.channel.send(`Could not notify ${guild.name}. They do not have a #altair channel`);
        }
      }
      message.react('✅');
    } else {
      message.channel.send('🔐 You cannot use this command');
    }
  }
};
