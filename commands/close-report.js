const sqlite = require('sqlite3');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

const Database = new sqlite.Database(path.join(process.cwd(), 'database/main.db'));

module.exports = class {
  constructor() {
    this.name = 'close';
  }

  async run(message) {
    if (message.staff) {
      Database.get('SELECT * FROM reports WHERE channel=?', [message.channel.id], (err, row) => {
        if (err !== null) {
          throw err;
        } else if (typeof row === 'undefined') {
          message.channel.send('❗ This channel is not a report channel');
        } else {
          Database.run('DELETE FROM reports WHERE channel=?', [message.channel.id], (errShadow) => {
            if (errShadow !== null) {
              throw errShadow;
            }
          });
          message.channel.delete();
        }
      });
    } else {
      message.channel.send('🔐 You cannot use this command');
    }
  }
};
