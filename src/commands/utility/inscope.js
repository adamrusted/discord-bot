const { DateTime } = require("luxon");
const { getGitHub } = require("../../utils/github");
const { SlashCommandBuilder, MessageFlags } = require("discord.js");

const TIMEZONE = process.env.TZ_IDENTIFIER || "Europe/London";

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
    console.log(interaction.locale);
    const sourceGitHub = await interaction.options.getString("url");
    const { stars, releaseDate, recent, error, repo } = await getGitHub(
      sourceGitHub
    );
    if (error) throw new Error(error);
    const gitURL = `[${repo.owner}/${repo.name}](${sourceGitHub})`;
    if (stars > 5000 && recent) {
      interaction.reply(
        `:tada: **${gitURL}** is in scope from GitHub with **${stars.toLocaleString()}** stars and a release on **${DateTime.fromISO(
          releaseDate,
          { setZone: TIMEZONE }
        ).toLocaleString()}**.`,
        { flags: [MessageFlags.SuppressEmbeds] }
      );
    } else {
      interaction.reply(
        `:cry: **${gitURL}** is not in scope with **${stars.toLocaleString()}** stars and **${DateTime.fromISO(
          releaseDate,
          { setZone: TIMEZONE }
        ).toLocaleString()}** being their most recent release...`,
        { flags: [MessageFlags.SuppressEmbeds] }
      );
    }
  },
};
