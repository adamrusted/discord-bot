const { DateTime } = require("luxon");
const { getGitHub } = require("../../utils/github");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("scope")
    .setDescription("Checks to see if a brand is in scope of our project")
    // .addStringOption((opt) =>
    //   opt
    //     .setName("url")
    //     .setDescription("The URL of the brand / product you'd like to include")
    // )
    .addStringOption((opt) =>
      opt
        .setName("github")
        .setDescription("The full URL of the GitHub repository")
    ),
  async execute(interaction) {
    // const sourceUrl = await interaction.options.getString("url");
    const sourceGitHub = await interaction.options.getString("github");
    const { stars, releaseDate, recent } = await getGitHub(sourceGitHub);
    if (stars > 5000 && recent) {
      interaction.reply(
        `In scope from GitHub with ${stars.toLocaleString()} stars and a release on ${DateTime.fromISO(
          releaseDate
        ).toLocaleString()}`
      );
    }
  },
};
