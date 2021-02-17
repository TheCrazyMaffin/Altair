const fs = require('fs');
const util = require('util');
const path = require('path');

fs.readFile = util.promisify(fs.readFile);

module.exports = class {
  constructor() {
    this.name = 'help';
  }

  async run(message) {
    const helpEmbed = new (require('../src/js/defaultEmbed'))('Altair - Help', { name: message.author.username, iconURL: message.author.displayAvatarURL() });
    helpEmbed.addField('Commands', await fs.readFile(path.join(process.cwd(), '/src/messages/help-commands.txt')));
    helpEmbed.addField('Open-Source', await fs.readFile(path.join(process.cwd(), '/src/messages/open-source.txt')));
    message.channel.send(helpEmbed);
  }
};
