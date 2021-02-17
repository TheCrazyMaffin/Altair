const AltairGuilds = require('../src/js/guilds');

module.exports = class {
  constructor() {
    this.name = 'ready';
  }

  async run() {
    console.log(`Logged in as ${global.Client.user.tag}`);
    (new AltairGuilds()).update();
  }
};
