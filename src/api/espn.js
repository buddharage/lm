// const espnRequest = require("./espn-request");
const querystring = require('querystring');
const axios = require('axios');
const { default: axiosCookieJarSupport } = require('axios-cookiejar-support');
const tough = require('tough-cookie');
const cookieJar = new tough.CookieJar();

const { ESPN_S2, ESPN_SWID } = process.env;

axiosCookieJarSupport(axios);

function espnRequest(url, params) {
  const espnS2 = new tough.Cookie({
    key: 'espn_s2',
    value: ESPN_S2,
    domain: 'espn.com',
  });
  const SWID = new tough.Cookie({
    key: 'SWID',
    value: ESPN_SWID,
    domain: 'espn.com',
  });

  console.log(cookieJar.setCookie);

  cookieJar.setCookie(espnS2, 'http://games.espn.com/', onCookieJarSet);
  cookieJar.setCookie(SWID, 'http://games.espn.com/', onCookieJarSet);

  const options = {
    method: 'GET',
    url,
    params,
    jar: cookieJar,
    responseType: 'json',
    withCredentials: true,
    'cache-control': 'no-cache',
    paramsSerializer: params => querystring.stringify(params),
  };

  return axios(options);
}

function onCookieJarSet(err, cookie) {
  if (err) throw new Error(err);

  console.log('SUCCESS - cookie was set to cookie jar');
}

function getLeagueScoreboard(leagueId, scoringPeriodId = '1', seasonId = 2018) {
  const queryParams = {
    scoringPeriodId,
    leagueId,
    seasonId,
  };

  // TODO: move this to axios' `paramsSerializer`
  // Ideally we would want to fold in `params` into the `options` we pass axios
  const query = querystring.stringify(queryParams);
  const url = `http://games.espn.com/ffl/api/v2/scoreboard?${query}`;

  // TODO: see about caching this -- getMatchups, for example, filters from the resulting promise
  return espnRequest(url);
}

function getMatchups(leagueId, scoringPeriod = 1, season = 2018) {
  return getLeagueScoreboard(leagueId, scoringPeriod, season).then(leagueData => {
    return leagueData.scoreboard.matchups;
  });
}

function getSpecificMatchup(leagueId, teamLocation, teamName, season = 2018) {
  return getMatchups(leagueId, season)
    .then(matchups => {
      return matchups.filter(matchup => {
        return (
          (matchup.teams[0].team.teamLocation === teamLocation &&
            matchup.teams[0].team.teamNickname === teamName) ||
          (matchup.teams[1].team.teamLocation === teamLocation &&
            matchup.teams[1].team.teamNickname === teamName)
        );
      });
    })
    .then(matchup => {
      return matchup[0].teams;
    })
    .then(teams => {
      return teams.map(team => {
        return {
          teamName: team.team.teamLocation + ' ' + team.team.teamNickname,
          score: team.score,
          wins: team.team.record.overallWins,
          losses: team.team.record.overallLosses,
          logoUrl: team.team.logoUrl,
          teamId: team.teamId,
        };
      });
    });
}

module.exports = {
  espnRequest,
  getLeagueScoreboard,
  getMatchups,
  getSpecificMatchup,
};
