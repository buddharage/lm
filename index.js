const espnFF = require("espn-ff-api");
const { espnS2, leagueId, SWID } = require("./config");

const cookies = {
  espnS2,
  SWID
};

//returns all league matchups in a simplified object
espnFF.getMatchups(cookies, leagueId).then(matchups => {
  matchups.map(({ teams, winner, bye }) => {
    console.log(
      `
      ${teams[0].team.teamLocation}: ${teams[0].score} vs ${
        teams[1].team.teamLocation
      }: ${teams[1].score}
      winner - ${winner}
      `
    );
  });
});
