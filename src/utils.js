// @ts-nocheck
const { ActivityType } = require("discord.js");
const { DateTime } = require("luxon");

const getNumbers = async () => {
  const myNumbers = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: `query ($RepositoryName: String!, $RepositoryOwner: String!) {
    repository(name: $RepositoryName, owner: $RepositoryOwner) {
        pullRequests(states: OPEN, first: 100, orderBy: { field: CREATED_AT, direction: ASC}) {
            totalCount
        }
        issues(states: OPEN, first: 100) {
            totalCount
        }
    }
}`,
      variables: {
        RepositoryOwner: process.env.REPOSITORY_OWNER,
        RepositoryName: process.env.REPOSITORY_NAME,
      },
    }),
  })
    .then((res) => res.json())
    .then((val) => {
      if (val.error) {
        throw new Error(val.error.message);
      }
      return {
        date: DateTime.now().toFormat("dd LLL yy H:mm ZZZZ"),
        issues: Number(val.data.repository.issues.totalCount).toLocaleString(),
        prs: Number(
          val.data.repository.pullRequests.totalCount
        ).toLocaleString(),
      };
    });
  return myNumbers;
};

const setBotStatus = async (client) => {
  const { date, prs, issues } = await getNumbers();
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
  client.user.setPresence({
    status: "dnd",
    activities: [
      {
        name: `${process.env.REPOSITORY_OWNER}/${process.env.REPOSITORY_NAME}`,
        state: `${issues} open issues and ${prs} open PRs as of ${date}`,
        type: ActivityType.Watching,
      },
    ],
  });
};

const getLatestRelease = async (client) => {
  const releaseDetails = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: `query ($RepositoryName: String!, $RepositoryOwner: String!) {
        repository(name: $RepositoryName, owner: $RepositoryOwner) {
            latestRelease {
                tagName
                url
                name
                publishedAt
            }
        }
      }`,
      variables: {
        RepositoryName: process.env.REPOSITORY_NAME,
        RepositoryOwner: process.env.REPOSITORY_OWNER,
      },
    }),
  })
    .then((res) => res.json())
    .then((val) => {
      // @ts-ignore
      const { errors, data } = val;
      if (errors) {
        throw new Error(errors[0].message);
      }
      const releaseDate = DateTime.fromISO(
        data.repository.latestRelease.publishedAt
      );
      const today = DateTime.now().startOf("day");
      if (releaseDate > today) {
        return data.repository.latestRelease;
      } else {
        return {};
      }
    });
  return releaseDetails;
};

module.exports = {
  setBotStatus,
  getLatestRelease,
};
