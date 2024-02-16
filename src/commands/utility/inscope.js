const { DateTime } = require("luxon");
const { getGitHub } = require("../../utils/github");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ghscope")
    .setDescription("Checks to see if a brand is in scope of our project")
    .addStringOption((opt) =>
      opt
        .setName("url")
        .setRequired(true)
        .setDescription("The full URL of the GitHub repository")
    ),
  async execute(interaction) {
    const sourceGitHub = await interaction.options.getString("url");
    const { stars, releaseDate, recent, error, repo } = await getGitHub(
      sourceGitHub
    );
    if (error) throw new Error(error);
    if (stars > 5000 && recent) {
      interaction.reply(
        `<:tada:> **${repo.owner}/${
          repo.name
        }** is in scope from GitHub with **${stars.toLocaleString()}** stars and a release on **${DateTime.fromISO(
          releaseDate
        ).toLocaleString()}**.`
      );
    } else {
      interaction.reply(
        `**${repo.owner}/${
          repo.name
        }<:cry:> ** is not in scope with **${stars.toLocaleString()}** stars and **${DateTime.fromISO(
          releaseDate
        ).toLocaleString()}** being their most recent release...`
      );
    }
  },
};
