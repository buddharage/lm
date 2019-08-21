const axios = require('axios');

const { SLACK_WEBHOOK_URL } = process.env;

function send(payload) {
  // Send to Slack
  return axios
    .post(SLACK_WEBHOOK_URL, JSON.stringify(payload))
    .then(data => {
      console.log('SUCCESS - sent league status to Slack');
      process.exitCode = 0;
    })
    .catch(e => {
      console.log('ERROR - send to Slack failed', e);
      process.exitCode = 1;
    });
}

module.exports = {
  send,
};
