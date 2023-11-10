const bcrypt = require("bcrypt");
const logger = require('./logger');

const authentication = (db) => {
    return (req, res, next) => {
        const authheader = req.headers.authorization;

        if (!authheader) {
            logger.info(`Don't have a auth header`);
            return res.status(401).json();
        }

        try {
            const authBase64 = authheader.split(' ')[1];
            const auth = atob(authBase64).split(':');
            const email = auth[0];
            const password = auth[1];
            db.accounts.findOne({ where: { email: email } }).then((user) => {
                if (!user) {
                    logger.info(`user ${email} not found!`);
                    return res.status(401).json()
                };
                bcrypt.compare(password, user.password, function (err, compareRes) {
                    if (err) {
                        logger.error(`bcrypt.compare error ${err}`);
                        return res.status(401).json();
                    } else if (!compareRes) {
                        logger.info(`user ${email} and password not match!`);
                        return res.status(401).json();
                    } else {
                        req.userid = user.id;
                        next();
                    }
                });
            }).catch((err) => {
                logger.error(err);
                return res.status(401).json();
            })
        } catch (err) {
            logger.error(err);
            return res.status(400).json();
        }
    }
}

module.exports = {
    authentication
};