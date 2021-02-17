module.exports = class {
  constructor() {
    this.name = 'interactionReceived';
  }

  async run(interaction) {
    if (global.Client.commands.has(interaction.name)) {
      await global.Client.commands.get(interaction.name)(interaction);
    }
  }
};
