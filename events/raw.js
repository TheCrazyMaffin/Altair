const fetch = require('node-fetch');

module.exports = class {
  constructor() {
    this.name = 'raw';
  }

  async run(raw) {
    if (typeof raw.t !== 'undefined' && raw.t === 'INTERACTION_CREATE') {
      const interaction = {
        id: raw.d.id,
        token: raw.d.token,
        name: raw.d.data.name,
        options: raw.d.data.options,
        guild: null,
        channel: null,
        member: null,
        async respond(message) {
          const json = {
            type: 4,
            data: {
              tts: false,
              content: message,
            },
          };
          const url = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;
          return (await fetch(url, {
            method: 'post',
            body: JSON.stringify(json),
            headers: { 'Content-Type': 'application/json' },
          })).text();
        },
      };
      interaction.guild = await global.Client.guilds.fetch(raw.d.guild_id);
      interaction.channel = interaction.guild.channels.cache.get(raw.d.channel_id);
      interaction.member = await interaction.guild.members.fetch(raw.d.member.user.id);
      global.Client.emit('interactionReceived', interaction);
    }
  }
};
