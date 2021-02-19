const { espnRequest, getLeagueScoreboard, getMatchups, getSpecificMatchup } = require('./espn');

describe('api/espn', () => {
  describe('espnRequest', () => {
    describe('when called with a url', () => {
      let result;
      const queryParams = {
        scoringPeriodId: '1',
        leagueId: '599637',
        seasonId: '2018',
      };

      beforeEach(() => {
        result = espnRequest('http://games.espn.com/ffl/api/v2/scoreboard', queryParams);
      });

      it('returns a promise', done => {
        result.then(response => {
          expect(response).toEqual('');
          done();
        });
      });
    });
  });
});
