const AltairGuilds = require('../src/js/guilds');

module.exports = class {
  constructor() {
    this.name = 'guildCreate';
  }

  async run() {
    (new AltairGuilds()).update();
  }
};
