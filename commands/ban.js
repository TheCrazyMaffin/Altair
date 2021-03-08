const AltairBan = require('../src/js/ban');

module.exports = class {
  constructor() {
    this.name = 'ban';
  }

  async run(message) {
    if (message.staff) {
      const ban = new AltairBan(message.content.split(' ')[1]);
      await ban.ban();
      await ban.update(message.content.split(' ').slice(2).join(' '));
      message.react('✅');
    } else {
      message.channel.send('🔐 You cannot use this command');
    }
  }
};
