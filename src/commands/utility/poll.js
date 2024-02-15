const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Runs a poll in the channel you posted this")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Changed from 'Administrator' to 'BanMembers' to allow moderator roles to welcome.
    .addStringOption((opt) =>
      opt
        .setRequired(true)
        .setName("query")
        .setDescription("Enter the query you would like people to respond to.")
    ),
  async execute(interaction) {
    const target = interaction.options.getString("poll");
    const message = await interaction.reply({
      content: `## New Poll from <@${interaction.user.id}>\n${target}`,
      fetchReply: true,
    });
    message.react("👍").then(() => message.react("👎"));
  },
};
