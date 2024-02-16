const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("onboard")
    .setDescription("[BETA] Onboard a new maintainer")
    .addUserOption((opt) =>
      opt
        .setName("person")
        .setDescription("The user you would like to add to the maintainer team")
        .setRequired(true)
    )
    .addRoleOption((opt) =>
      opt
        .setName("role")
        .setDescription("The role you are giving the user")
        .setRequired(true)
    ),
  async execute(interaction) {},
};
