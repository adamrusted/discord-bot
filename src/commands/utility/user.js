const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Welcome a user to the server!")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Changed from 'Administrator' to 'BanMembers' to allow moderator roles to welcome.
    .addUserOption((option) =>
      option
        .setName("user")
        .setRequired(true)
        .setDescription("The user you are welcoming to the server"),
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("user");
    if (!!process.env.VERIFY_CHANNEL) {
      await interaction.reply(
        `Welcome, <@${target.id}> 👋\n\nSee <#${process.env.VERIFY_CHANNEL}> for instructions on how to gain access to all channels here.`,
      );
    } else {
      await interaction.reply(`Welcome, <@${target.id}> 👋`);
    }
  },
};
