// @ts-nocheck

import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import "dotenv/config";
import { setBotStatus, getLatestRelease } from "./utils.js";
import cron from "node-cron";
import { DateTime } from "luxon";

const TIMEZONE = process.env.TZ_IDENTIFIER || "Europe/London";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(
    `${DateTime.local({ zone: TIMEZONE }).toFormat("H:mm")} | Logged in as ${
      readyClient.user.displayName
    }`
  );
  setBotStatus(readyClient);
});

if (!!process.env.UPDATES_CRON) {
  cron.schedule(process.env.UPDATES_CRON, () => {
    console.log(
      `${DateTime.local({ zone: TIMEZONE }).toFormat(
        "H:mm"
      )} | Setting Stats Channel Names`
    );
    setBotStatus(client);
  });
}

if (
  !!process.env.RELEASE_NOTIFICATION_ROLE &&
  !!process.env.RELEASE_NOTIFICATION_CHANNEL &&
  !!process.env.RELEASE_CRON
) {
  cron.schedule(process.env.RELEASE_CRON, async () => {
    console.log(
      `${DateTime.local({ zone: TIMEZONE }).toFormat(
        "H:mm"
      )} | Posting about Latest Release`
    );
    const release = await getLatestRelease(client);
    const releasesChannel = client.channels.cache.get(
      process.env.RELEASE_NOTIFICATION_CHANNEL
    );
    releasesChannel
      .send({
        content: `<@&${process.env.RELEASE_NOTIFICATION_ROLE}> ${release.url}`,
        flags: [MessageFlags.SuppressEmbeds],
      })
      .then((message) => {
        message.crosspost();
      })
      .finally(() =>
        console.log(
          `${DateTime.local({ zone: TIMEZONE }).toFormat("H:mm")} | Release ${
            release.tagName
          } Posted`
        )
      );
  });
}

client.login(process.env.DISCORD_TOKEN);
