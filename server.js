const { app, db } = require('./app');
const init = require('./init');

app.listen(8080, async () => {
    await db.sequelize.sync();
    await init.initAccount(db);
    console.log('App is listening on port 8080.');
});