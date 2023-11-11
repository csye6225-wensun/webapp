const StatsD = require('node-statsd');
const statsDClient = new StatsD();

function countAPICalls(method, url) {
    statsDClient.increment(`Count of Api calls (${method} ${url})`);
}

async function closeStatsDClient() {
    await statsDClient.close();
}

module.exports = { countAPICalls, closeStatsDClient };