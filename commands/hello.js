module.exports = {
  name: 'hello',
  description: 'Hello!',
  execute(msg, args) {
    msg.reply('Hi');
    //msg.channel.send('Hi' );
  },
};
