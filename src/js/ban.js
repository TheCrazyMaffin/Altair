const sqlite = require('sqlite3');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const AltairGuilds = require('./guilds');

const Database = new sqlite.Database(path.join(process.cwd(), 'database/main.db'));

/**
 * Class for Bans in the Altair Database
 * Fetch the ban before using
 * @class AltairBan
 */
class AltairBan {
  constructor(userId) {
    this.userId = userId;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      Database.get('SELECT * FROM bans WHERE id=?', [this.userId], async (err, row) => {
        if (err !== null) {
          reject(err);
        } else if (typeof row === 'undefined') {
          this.exists = false;
          resolve(this);
        } else {
          this.exists = true;
          try {
            /** @type Discord.User */
            this.moderator = await global.Client.users.fetch(row.moderator);
          } catch (error) {
            /** @type Discord.User */
            this.moderator = global.Client.user;
          }
          this.reason = row.reason;
          /** @type Discord.User */
          this.user = await global.Client.users.fetch(this.userId);
          resolve(this);
        }
      });
    });
  }

  async claim(moderator) {
    if (typeof this.exists === 'undefined') {
      await this.fetch();
    }
    if (!this.exists) {
      throw new Error('Cannot claim a non-existant case');
    } else {
      Database.run('UPDATE bans SET moderator=? WHERE id=?', [moderator, this.userId]);
    }
  }

  async update(reason) {
    if (typeof this.exists === 'undefined') {
      await this.fetch();
    }
    if (!this.exists) {
      throw new Error('Cannot update a non-existant case');
    } else {
      Database.run('UPDATE bans SET reason=? WHERE id=?', [reason, this.userId]);
    }
  }

  async ban(moderator = '', reason = '') {
    if (typeof this.exists === 'undefined') {
      await this.fetch();
    }
    if (this.exists) {
      throw new Error('This user is already banned');
    } else {
      const currentGuilds = new AltairGuilds();
      await currentGuilds.fetchGuilds();
      currentGuilds.ban(this.userId);
      Database.run('INSERT INTO bans (id,moderator,reason) VALUES (?,?,?)', [this.userId, moderator, reason], (err) => {
        if (err !== null) {
          throw err;
        }
      });
    }
  }

  async pardon() {
    if (typeof this.exists === 'undefined') {
      await this.fetch();
    }
    if (!this.exists) {
      throw new Error('Cannot delete a non-existant case');
    } else {
      Database.run('DELETE FROM bans WHERE id=?', [this.userId]);
      const currentGuilds = new AltairGuilds();
      await currentGuilds.fetchGuilds();
      const pardonEmbed = new (require('./defaultEmbed'))('Ban pardoned', { name: 'System' });
      pardonEmbed.setDescription(`The staff pardoned the ban of ${this.user.username}#${this.user.discriminator} (${this.user.id}).\nThere are no automatic unbans, if you decide to unban them aswell you will have to do this manually.`);
      currentGuilds.notify();
    }
  }
}

module.exports = AltairBan;
