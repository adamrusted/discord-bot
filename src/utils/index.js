require("dotenv").config();
const { DateTime } = require("luxon");

const TIMEZONE = process.env.TZ_IDENTIFIER || "Europe/London";

const getNumbers = (stats) => {
  const { issues, prs } = stats;
  const date = DateTime.now().setLocale("en-GB").setZone(TIMEZONE);
  return {
    date: `${date.toFormat("dd LLL yy H:mm")} ${date.offsetNameShort}`,
    issues: Number(issues).toLocaleString(),
    prs: Number(prs).toLocaleString(),
  };
};

const setChannelInfo = (client, stats) => {
  const { date, prs, issues } = getNumbers(stats);
  if (!!process.env.UPDATED_AT_CHANNEL) {
    client.channels.cache
      .get(process.env.UPDATED_AT_CHANNEL)
      .setName(`As of ${date}`);
  }
  if (!!process.env.PRS_CHANNEL) {
    client.channels.cache
      .get(process.env.PRS_CHANNEL)
      .setName(`${prs} Open PRs`);
  }
  if (!!process.env.ISSUES_CHANNEL) {
    client.channels.cache
      .get(process.env.ISSUES_CHANNEL)
      .setName(`${issues} Open Issues`);
  }
};

module.exports = {
  setChannelInfo,
};
