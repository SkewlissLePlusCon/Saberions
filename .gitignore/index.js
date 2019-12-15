const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require('fs');

fs.readdir('./Commandes/', (error, f) => {
    if (error) { return console.error(error); }
        let commandes = f.filter(f => f.split('.').pop() === 'js');
        if (commandes.length <= 0) { return console.log('Aucune commande trouvée !'); }

        commandes.forEach((f) => {
            let commande = require(`./Commandes/${f}`);
            console.log(`${f} commande chargée !`);
            client.commands.set(commande.help.name, commande);
        });
});

fs.readdir('./Events/', (error, f) => {
    if (error) { return console.error(error); }
        console.log(`${f.length} events chargés`);

        f.forEach((f) => {
            let events = require(`./Events/${f}`);
            let event = f.split('.')[0];
            client.on(event, events.bind(null, client));
        });
});


const DiscordAntiSpam = require("discord-anti-spam");
const AntiSpam = new DiscordAntiSpam({
  warnThreshold: 3, 
  banThreshold: 7, 
  maxInterval: 2000, 
  warnMessage: "{@user}, S'il te plait arrête de spammer", 
  banMessage: "**{user_tag}** a été banni pour avoir spam.", 
  maxDuplicatesWarning: 7, 
  maxDuplicatesBan: 15, 
  deleteMessagesAfterBanForPastDays: 1, 
  exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR", "MANAGE_GUILD", "BAN_MEMBERS"], 
  ignoreBots: true, 
  verbose: false, 
  ignoredUsers: [], 
  ignoredRoles: [], 
  ignoredGuilds: [], 
  ignoredChannels: [] 
});
 
AntiSpam.on("warnEmit", (member) => console.log(`Attempt to warn ${member.user.tag}.`));
AntiSpam.on("warnAdd", (member) => console.log(`${member.user.tag} a été averti.`));
AntiSpam.on("kickEmit", (member) => console.log(`Attempt to kick ${member.user.tag}.`));
AntiSpam.on("kickAdd", (member) => console.log(`${member.user.tag} a été kick.`));
AntiSpam.on("banEmit", (member) => console.log(`Attempt to ban ${member.user.tag}.`));
AntiSpam.on("banAdd", (member) => console.log(`${member.user.tag} a été banni.`));
AntiSpam.on("dataReset", () => console.log("Le module cache a été clear."));
 
client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));
 
client.on("message", (msg) => {
  AntiSpam.message(msg);
});

client.on("guildMemberAdd", user =>{
  let joinEmbed = new Discord.RichEmbed()
  .setColor("#52f411")
  .setAuthor(user.user.username, user.user.displayAvatarURL)
  .setDescription(":grin: Bienvenue" + user + " sur notre serveur **" + user.guild.name + "** !")
  .setFooter("Saberions Game | By Skewliss", 'https://i.imgur.com/UxNctHU.png')
  user.guild.channels.get("548348879226142722").send(joinEmbed)
});

client.on("guildMemberRemove", user =>{
  let leaveEmbed = new Discord.RichEmbed()
  .setColor("#f41111")
  .setAuthor(user.user.username, user.user.displayAvatarURL)
  .setDescription(":cry: Sniff..." + user + " a quitté notre serveur **" + user.guild.name + "** !")
  .setFooter("Saberions Game | By Skewliss", 'https://i.imgur.com/UxNctHU.png')
  user.guild.channels.get("548348879226142722").send(leaveEmbed)
});

client.login(process.env.TOKEN);
