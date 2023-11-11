const request = require('supertest')
const { app, db, statsd } = require('../app')
const init = require('../init');

const server = app.listen(8080, () => { console.log('App is listening on port 8080.'); });

beforeAll(async () => {
    await db.sequelize.sync();
    await init.initAccount(db);
})

afterAll(async () => {
    await statsd.closeStatsDClient();
    await db.sequelize.close();
    await server.close();
});

describe('Get Healthz', () => {
    it('get healthz should return 200', (done) => {
        request(app)
            .get('/healthz')
            .send()
            .end(function (err, res) {
                expect(res.statusCode).toEqual(200);
                if (err) {
                    throw err;
                }
                done();
            });
    })
});
