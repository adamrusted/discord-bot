const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Runs a poll in the channel you posted this")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Changed from 'Administrator' to 'BanMembers' to allow moderator roles to welcome.
    .addStringOption((opt) => {
        opt
            .setRequired(true)
            .setName('poll')
    }),
  async execute(interaction) {
    const target = interaction.options.getString("poll");
    await interaction.reply(`# New Poll\n${target}`).then((reply) => {
        reply.react('👍').then((reply) => {
            reply.react('👎')
        })
    })
  },
};
