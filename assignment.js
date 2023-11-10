const { assignments } = require("./models");
const logger = require('./logger');

const getAssignments = (db) => {
    return (req, res) => {
        db.assignments.findAll({
            attributes: ['id', 'name', 'points', 'num_of_attemps', 'deadline', 'assignment_created', 'assignment_updated']
        }).then((assignments) => {
            return res.status(200).json(assignments);
        }).catch((err) => {
            logger.error(err);
            return res.status(400).json();
        });
    }
};

const postAssignments = (db) => {
    return (req, res) => {
        const body = req.body;

        const d = new Date();
        db.assignments.create({
            name: body.name,
            points: body.points,
            num_of_attemps: body.num_of_attemps,
            deadline: body.deadline,
            account_created: d.toString(),
            account_updated: d.toString(),
            onwer: req.userid
        }).then(assignment => {
            return res.status(201).json(assignment);
        }).catch(err => {
            logger.error(err);
            return res.status(400).json();
        });
    }
};

const getAssignmentByid = (db) => {
    return (req, res) => {
        db.assignments.findOne({
            where: { id: req.params.id }
        }).then((assignment) => {
            if (!assignment) {
                logger.info(`Can't find assignment ${req.params.id}`);
                return res.status(404).json();
            }
            if (assignment.onwer != req.userid) {
                logger.info(`Not the assignment (${req.params.id}) owner (${req.userid})`);
                return res.status(403).json();
            } else {
                return res.status(200).json(assignment);
            }
        }).catch((err) => {
            logger.error(err);
            return res.status(400).json();
        });
    }
};

const delAssignmentByid = (db) => {
    return (req, res) => {
        const body = req.body;

        if (!req.params.id) {
            logger.info(`Don't have a assignment id`);
            return res.status(404).json();
        }
        db.assignments.findOne({
            where: { id: req.params.id }
        }).then((assignment) => {
            if (!assignment) {
                logger.info(`Can't find assignment ${req.params.id}`);
                return res.status(404).json();
            }
            if (assignment.onwer != req.userid) {
                logger.info(`Not the assignment (${req.params.id}) owner (${req.userid})`);
                return res.status(403).json();
            } else {
                db.assignments.destroy({
                    where: { id: req.params.id }
                }).then(() => {
                    return res.status(204).json();
                }).catch((err) => {
                    logger.error(err);
                    return res.status(400).json();
                });
            }
        }).catch((err) => {
            logger.error(err);
            return res.status(400).json();
        });
    }
};

const putAssignmentByid = (db) => {
    return (req, res) => {
        const body = req.body;
        if (!req.params.id) {
            logger.info(`Don't have a assignment id`);
            return res.status(404).json();
        }
        db.assignments.findOne({
            where: { id: req.params.id }
        }).then((assignment) => {
            if (!assignment) {
                logger.info(`Can't find assignment ${req.params.id}`);
                return res.status(404).json();
            }
            if (assignment.onwer != req.userid) {
                logger.info(`Not the assignment (${req.params.id}) owner (${req.userid})`);
                return res.status(403).json();
            } else {
                db.assignments.update({
                    name: body.name,
                    points: body.points,
                    num_of_attemps: body.num_of_attemps,
                    deadline: body.deadline,
                },
                    {
                        where: { id: req.params.id }
                    }).then(() => {
                        return res.status(204).json();
                    }).catch((err) => {
                        logger.error(err);
                        return res.status(400).json();
                    });
            }
        }).catch((err) => {
            logger.error(err);
            return res.status(400).json();
        });
    }
};

module.exports = {
    getAssignments,
    getAssignmentByid,
    postAssignments,
    delAssignmentByid,
    putAssignmentByid
};