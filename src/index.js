require("dotenv").config();
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { setChannelInfo, getLatestRelease } = require("./utils.js");
const cron = require("node-cron");
const {runCommand} = require('./commands/runCommand.js')

const TIMEZONE = process.env.TZ_IDENTIFIER || "Europe/London";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Client Startup
client.once(Events.ClientReady, (readyClient) => {
  readyClient.user.setStatus("dnd");
  console.log(`Logged in as ${readyClient.user.displayName}`);
});

// Run Commands
client.on(Events.InteractionCreate, runCommand(interaction));

// Channel Title Updates
if (!!process.env.UPDATES_CRON) {
  cron.schedule(process.env.UPDATES_CRON, () => {
    console.log("Setting Stats Channel Names");
    setChannelInfo(client);
  });
}

if (
  !!process.env.RELEASE_NOTIFICATION_ROLE &&
  !!process.env.RELEASE_NOTIFICATION_CHANNEL &&
  !!process.env.RELEASE_CRON
) {
  cron.schedule(process.env.RELEASE_CRON, async () => {
    console.log("Posting about Latest Release");
    const release = await getLatestRelease(client);
    const releasesChannel = client.channels.cache.get(
      process.env.RELEASE_NOTIFICATION_CHANNEL
    );
    releasesChannel
      .send({
        content: `<@&${process.env.RELEASE_NOTIFICATION_ROLE}> ${release.url}`,
      })
      .then((message) => {
        message.crosspost();
      })
      .finally(() => console.log(`Release ${release.tagName} Posted`));
  });
}

client.login(process.env.DISCORD_TOKEN);
