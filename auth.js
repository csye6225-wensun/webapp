const bcrypt = require("bcrypt");

const authentication = (db) => {
    return (req, res, next) => {
        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(401).send("");
        }

        const auth = authheader.split(':');
        const email = auth[0];
        const password = auth[1];

        db.accounts.findOne({ where: { email: email } }).then((user) => {
            if (!user) return res.status(401).send("");
            bcrypt.compare(password, user.password, function (err, compareRes) {
                if (err) {
                    return res.status(401).send("");
                } else if (!compareRes) {
                    return res.status(401).send("");
                } else {
                    req.userid = user.id;
                    next();
                }
            });
        }).catch((err) => {
            return res.status(401).send("");
        })
    }
}

module.exports = {
    authentication
};