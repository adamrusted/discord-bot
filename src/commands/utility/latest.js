const { SlashCommandBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const { getLatestStats } = require("../../utils/github");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("latest")
    .setDescription("Posts the latest release of the main project."),
  async execute(int) {
    const { data, error } = await getLatestStats();
    const postedDate = DateTime.fromISO(
      data.latestRelease.publishedAt,
    ).toFormat("dd LLL yy H:mm ZZZZ");
    if (error) throw new Error(error.message);
    int.reply(
      `The latest release is [${data.latestRelease.tagName}](${data.latestRelease.url}), and released ${postedDate}.`,
    );
  },
};
