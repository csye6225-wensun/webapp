const StatsD = require('node-statsd');
const statsDClient = new StatsD();

function countAPICalls(method, url) {
    statsDClient.increment(`Count of Api calls (${method} ${url})`);
}

module.exports = { countAPICalls };