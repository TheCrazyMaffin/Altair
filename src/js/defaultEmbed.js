const Discord = require('discord.js');

/**
 * @typedef {Object} EmbedAuthor
 * @property {String} name - The authors name.
 * @property {String} iconURL - URL to the profile picture of the author.
 */

/**
 * The preformatted embed to enfroce style rules.
 *
 * @class DefaultEmbed
 * @augments Discord.MessageEmbed
 */
 class DefaultEmbed extends Discord.MessageEmbed{
  /**
   * 
   * @param {String} title Embed title
   * @param {EmbedAuthor} author 
   * @param {String} color 
   */
  constructor(title, author, color = process.env.DEFAULT_COLOR) {
    super();
    this.setTitle(title);
    this.setAuthor(author.name, author.iconURL);
    this.setColor(color);
    this.setTimestamp();
  };
}

module.exports = DefaultEmbed;

