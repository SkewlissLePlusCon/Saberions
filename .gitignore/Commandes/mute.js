const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {
  let muteUser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  if (!muteUser) return message.channel.send("L'utilisateur n'existe pas !");

  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.channel.send("Vous n'avez pas les permissions.");

  if (muteUser.hasPermission("MANAGE_MESSAGES"))
    return message.channel.send("Vous ne pouvez pas mute cette personne.");

  let muteRole = message.guild.roles.find(`name`, 'muted');

  if (!muteRole) {
    try {
      muteRole = await message.guild.createRole({
        name: "muted",
        color: "#000",
        permissions: []
      });
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      console.log(e.stack)
    }
  }

  let muteTime = args[1];
  if (!muteTime) return message.channel.send("Spécifier un durée");

  await muteUser.addRole(muteRole.id);
  message.channel.send(`<@${muteUser.id}> est muté pour ${ms(ms(muteTime))}.`);

  setTimeout(() => {
    muteUser.removeRole(muteRole.id);
    message.channel.send(`<@${muteUser.id}> n'est plus muté.`);
  }, ms(muteTime))
};

module.exports.help = {
  name: "mute"
};
