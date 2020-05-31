module.exports = {
  name: '!ping',
  description: 'Ping!',
  id:{
    chris:0001,
  },
  execute(msg, args) {
    msg.reply('pong');
    msg.channel.send('pong'+ this.id.chris);
  },
};
