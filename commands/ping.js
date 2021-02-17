module.exports = class {
  constructor() {
    this.name = 'ping';
  }

  async run(message) {
    message.channel.send(`⏳ Pong. Websocket ping is \`${Math.round(global.Client.ws.ping)}ms\``);
  }
};
