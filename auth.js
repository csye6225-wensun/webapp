const bcrypt = require("bcrypt");

const authentication = (db) => {
    return (req, res, next) => {
        const authheader = req.headers.authorization;

        if (!authheader) {
            return res.status(401).json();
        }

        try {
            const authBuf = atob(authheader);
            const auth = authBuf.split(' ')[1].split(':');
            const email = auth[0];
            const password = auth[1];
            db.accounts.findOne({ where: { email: email } }).then((user) => {
                if (!user) return res.status(401).json();
                bcrypt.compare(password, user.password, function (err, compareRes) {
                    if (err) {
                        return res.status(401).json();
                    } else if (!compareRes) {
                        return res.status(401).json();
                    } else {
                        req.userid = user.id;
                        next();
                    }
                });
            }).catch((err) => {
                return res.status(401).json();
            })
        } catch (err) {
            return res.status(400).json();
        }
    }
}

module.exports = {
    authentication
};