const { assignments } = require("./models");

const getAssignments = (db) => {
    return (req, res) => {
        if (req.query.id) {
            return getAssignmentByid(req, res, db);
        }
        db.assignments.findAll({
            attributes: ['id', 'name', 'points', 'num_of_attemps', 'deadline', 'assignment_created', 'assignment_updated']
        }).then((assignments) => {
            return res.status(200).send(assignments);
        }).catch((err) => {
            return res.status(400).send("");
        });
    }
};

const postAssignments = (db) => {
    return (req, res) => {
        const d = new Date();
        db.assignments.create({
            name: req.query.name,
            points: req.query.points,
            num_of_attemps: req.query.num_of_attemps,
            deadline: req.query.deadline,
            account_created: d.toString(),
            account_updated: d.toString(),
            onwer: req.userid
        }).then(assignment => {
            return res.status(201).send(assignment);
        }).catch(err => {
            return res.status(400).send("");
        });
    }
};

const getAssignmentByid = (req, res, db) => {
    db.assignments.findOne({
        where: { id: req.query.id }
    }).then((assignment) => {
        if (assignment.onwer != req.userid) {
            return res.status(403).send("");
        } else {
            return res.status(200).send(assignment);
        }
    }).catch((err) => {
        return res.status(404).send("");
    });
};

const delAssignmentByid = (db) => {
    return (req, res) => {
        if (!req.query.id) {
            return res.status(404).send("");
        }
        db.assignments.findOne({
            where: { id: req.query.id }
        }).then((assignment) => {
            if (assignment.onwer != req.userid) {
                return res.status(403).send("");
            } else {
                db.assignments.destroy({
                    where: { id: req.query.id }
                }).then(() => {
                    return res.status(204).send("");
                }).catch((err) => {
                    return res.status(400).send("");
                });
            }
        }).catch((err) => {
            return res.status(404).send("");
        });
    }
};

const putAssignmentByid = (db) => {
    return (req, res) => {
        if (!req.query.id) {
            return res.status(404).send("");
        }
        db.assignments.findOne({
            where: { id: req.query.id }
        }).then((assignment) => {
            if (assignment.onwer != req.userid) {
                return res.status(403).send("");
            } else {
                db.assignments.update({
                    name: req.query.name,
                    points: req.query.points,
                    num_of_attemps: req.query.num_of_attemps,
                    deadline: req.query.deadline,
                },
                    {
                        where: { id: req.query.id }
                    }).then(() => {
                        return res.status(204).send("");
                    }).catch((err) => {
                        return res.status(400).send("");
                    });
            }
        }).catch((err) => {
            return res.status(404).send("");
        });
    }
};

module.exports = {
    getAssignments,
    postAssignments,
    delAssignmentByid,
    putAssignmentByid
};