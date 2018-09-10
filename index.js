const espnFF = require("espn-ff-api");
const { espnS2, SWID } = require("./config");

if (!process.argv[2] || typeof parseInt(process.argv[2], 10) === "NaN") {
  throw "League ID required";
}

const leagueId = process.argv[2];

const cookies = {
  espnS2,
  SWID
};

const verbs = [
  "punishes :punch:",
  "crushes :hammer:",
  "walks :walking: all over",
  ":boom: destroys :boom:",
  "embarasses :flushed:",
  "opens a can of :boxing_glove: whoop ass :boxing_glove: on",
  "pummels :cricket_bat_and_ball",
  "works over :weary:",
  "cruises by :car:",
  ":clap: easily handles :clap:",
  ":warning: mops the floor with :warning:",
  "rings the :bell: of"
];

//returns all league matchups in a simplified object
const getMatchups = async (cookies, leagueId) => {
  let fantasyKing;
  let fantasySacko;

  const results = await espnFF.getMatchups(cookies, leagueId).then(matchups => {
    return matchups.reduce((summary, { teams }) => {
      let winner = teams[0];
      let loser = teams[1];

      if (loser.score > winner.score) {
        winner = teams[1];
        loser = teams[0];
      }

      if (winner.score - loser.score >= 10)
        verb = verbs[Math.floor(Math.random() * verbs.length)];

      if (!fantasyKing || winner.score > fantasyKing.score) {
        fantasyKing = winner;
      }

      if (!fantasySacko || loser.score < fantasySacko.score) {
        fantasySacko = loser;
      }

      return (summary += `
  *${winner.team.teamLocation} ${winner.team.teamNickname}* (${
        winner.team.teamAbbrev
      }) ${verb} *${loser.team.teamLocation} ${loser.team.teamNickname}* (${
        winner.team.teamAbbrev
      })
  ${winner.score} to ${loser.score}

`);
    }, "");
  });

  return `@here: *This week's results*
  
  ${results} 

  This week's fantasy king: *${fantasyKing.team.teamLocation} ${
    fantasyKing.team.teamNickname
  }* (${fantasyKing.team.teamAbbrev})
  This week's fantasy sacko: *${fantasySacko.team.teamLocation} ${
    fantasySacko.team.teamNickname
  }* (${fantasySacko.team.teamAbbrev})
`;
};

function sendToSlack(payload) {
  // Send to Slack
  return fetch(config.slack.hookUrl, {
    method: "POST",
    body: JSON.stringify(payload)
  })
    .then(res => res)
    .then(data => {
      process.exitCode = 0;
    })
    .catch(e => {
      process.exitCode = 1;
    });
}

async function run() {
  const results = await getMatchups(cookies, leagueId);

  console.log(results);

  // const payload = {
  //   emojii: config.slack.emojii,
  //   username: config.slack.username,
  //   text: results
  // };

  // sendToSlack(payload);

  process.exitCode = 0;
}

try {
  run();
} catch (e) {
  throw e;
  process.exitCode = 1;
}
