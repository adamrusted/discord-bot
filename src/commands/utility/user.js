const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Welcome a user to the server!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setRequired(true)
        .setDescription("The user you are welcoming to the server")
    ),
  async execute(interaction) {
    await interaction.reply({ content: "Secret Pong!", ephemeral: true });
  },
};
