require("dotenv").config();
const { DateTime } = require("luxon");

const getGitHub = async (ghURL) => {
  try {
    const url = ghURL.toString().split("/");
    const {
      data: {
        repository: {
          stargazerCount: stars,
          latestRelease: { createdAt: releaseDate },
        },
      },
    } = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: `query ($RepositoryName: String!, $RepositoryOwner: String!) {
                    repository(name: $RepositoryName, owner: $RepositoryOwner) {
                        stargazerCount
                        latestRelease {
                            createdAt
                        }
                    }
                }`,
        variables: {
          RepositoryOwner: url[3],
          RepositoryName: url[4],
        },
      }),
    }).then((val) => val.json());
    return {
      stars,
      releaseDate,
      recent:
        DateTime.fromISO(releaseDate) > DateTime.now().minus({ months: 2 }),
      repo: {
        name: url[4],
        owner: url[3],
      },
    };
  } catch (err) {
    console.log(err);
    return {
      error: err.message,
      repo: {
        name: url[4],
        owner: url[3],
      },
    };
  }
};

module.exports = {
  getGitHub,
};
