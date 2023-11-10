const { app, db } = require('./app');
const init = require('./init');
const { logger, } = require('./logger');

app.listen(8080, async () => {
    await db.sequelize.sync();
    await init.initAccount(db);
    logger.info('App is listening on port 8080.');
});