require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { setChannelInfo, getLatestRelease } = require("./utils.js");
const cron = require("node-cron");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Client Startup
client.once(Events.ClientReady, (readyClient) => {
  readyClient.user.setStatus("dnd");
  console.log(`Logged in as ${readyClient.user.displayName}`);
});

// Load Commands
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

// Run Commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

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
      process.env.RELEASE_NOTIFICATION_CHANNEL,
    );
    await releasesChannel
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
