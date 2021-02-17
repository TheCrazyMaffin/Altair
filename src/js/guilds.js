const sqlite = require('sqlite3');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

const Database = new sqlite.Database(path.join(process.cwd(), 'database/main.db'));

/**
 * @typedef {Object} AltairGuild
 * @augments Discord.Guild
 * @property {Integer} autobans - If autobans are enabled
 * @property {String} staff_main_role - ID of the staff main role
 * @property {Discord.TextChannel} logging - The TextChannel for autoban notifications.
 */

class AltairGuilds {
  fetchGuilds() {
    return new Promise((resolve, reject) => {
      Database.all('SELECT * FROM guilds', (err, rows) => {
        if (err !== null) {
          reject(err);
        } else {
          /** @type {AltairGuild[]} */
          this.guilds = [];
          for (const row of rows) {
            const guildObj = global.Client.guilds.cache.get(row.id);
            guildObj.autobans = row.autobans;
            guildObj.staff_main_role = row.staff_main_role;
            guildObj.logging = row.logging === null ? null : global.Client.channels.cache.get(row.logging);
            this.guilds.push(guildObj);
          }
          resolve(this);
        }
      });
    });
  }

  notify(embed) {
    for (const guild of this.guilds) {
      if (guild.logging !== null) {
        guild.logging.send(embed);
      }
    }
  }

  async ban(userId) {
    const user = await global.Client.users.fetch(userId);
    const banEmbed = new (require('./defaultEmbed'))('Global ban', { name: `${user.username} (${user.id})`, iconURL: user.displayAvatarURL() });
    banEmbed.setFooter(`More information: ${process.env.PREFIX}info ${user.id}`);
    this.notify(banEmbed);
    for (const guild of this.guilds) {
      if (guild.autobans === 1) {
        try {
          await guild.members.ban(user, { reason: `More information: ${process.env.PREFIX}info ${user.id}` });
        } catch (error) {
          if (guild.logging !== null) {
            guild.logging.send(`⚠ You have enabled autobans but I was unable to ban ${user.username} (${user.id}). Please check your permissions setup! Debug: \`${error.message}\``);
          }
        }
      }
    }
  }

  async update() {
    const currentGuilds = new AltairGuilds();
    await currentGuilds.fetchGuilds();
    for (const guild of global.Client.guilds.cache.array()) {
      if (!currentGuilds.guilds.some((g) => g.id === guild.id)) {
        Database.run('INSERT INTO guilds (id) VALUES (?)', [guild.id], (err) => {
          if (err !== null) {
            throw err;
          }
        });
      }
    }
  }
}

module.exports = AltairGuilds;
