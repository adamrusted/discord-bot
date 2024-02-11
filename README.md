# GitHub Stats Discord Bot

This bot is built primarily for the [Simple Icons] Discord server. We wanted a way to show statistics about our primary repository within Discord using voice channels.

## Get Started

1. Copy `.env.example` to `.env` and populate the values. Details can be found below.

|            Variable            | Description                                                                                                                     | Mandatory? |
| :----------------------------: | :------------------------------------------------------------------------------------------------------------------------------ | :--------: |
|         `GITHUB_TOKEN`         | A GitHub Personal Access Token (PAT) which has permission to read your organisation data. You can create one [here][github-pat] |    Yes     |
|       `REPOSITORY_NAME`        | The name of the repository you'd like to monitor, in our example `simple-icons`.                                                |    Yes     |
|       `REPOSITORY_OWNER`       | The user/organisation that owns the repository you'd like to monitor. In our case this is also `simple-icons`.                  |    Yes     |
|        `DISCORD_TOKEN`         | The [bot token][create-discord-bot] for your Discord bot.                                                                       |    Yes     |
|      `UPDATED_AT_CHANNEL`      | The [ID][find-discord-id] of the Discord channel you'd like to post the 'last updated' time to.                                 |     No     |
|         `PRS_CHANNEL`          | The [ID][find-discord-id] of the Discord channel you'd like to post the number of open PRs to.                                  |     No     |
|        `ISSUES_CHANNEL`        | The [ID][find-discord-id] of the Discord channel you'd like to post the number of open issues to.                               |     No     |
|         `UPDATES_CRON`         | A [CRON] code for how often the bot should update its' bio and the channels (if set)                                            |     No     |
| `RELEASE_NOTIFICATION_CHANNEL` | The [ID][find-discord-id] of the Discord channel you'd like to send release notifications to.                                   |     No     |
|  `RELEASE_NOTIFICATION_ROLE`   | The [ID][find-discord-id] of the Discord role you'd like to notify of a release.                                                |     No     |
|         `RELEASE_CRON`         | A [CRON] code for when the bot should check for releases.                                                                       |     No     |
|        `TZ_IDENTIFIER`         | The [timezone identifier][timezones] for your preferred region. Defaults to `Europe/London`.                                    |     No     |

1. Install dependencies with `npm install`.
2. Build the bot with `npm run build`.
3. Run the bot with `node dist/index`.

## Development

If you're testing this locally, you can use the command `npm run dev` to run nodemon with TypeScript support.

## To-Do

- [ ] Add Discussions Channel
- [ ] Add Latest Release Channel

[timezones]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List
[create-discord-bot]: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot
[find-discord-id]: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID
[github-pat]: https://github.com/settings/tokens?type=beta
[Simple Icons]: https://github.com/simple-icons/simple-icons
