const logger = require('./logger');
const sns = require('./sns');

const getAssignments = (db) => {
    return async (req, res) => {
        try {
            const assignments = await db.assignments.findAll({
                attributes: ['id', 'name', 'points', 'num_of_attemps', 'deadline', 'assignment_created', 'assignment_updated']
            });
            return res.status(200).json(assignments);
        } catch (err) {
            logger.error(err);
            return res.status(400).json();
        }
    }
};

const postAssignments = (db) => {
    return async (req, res) => {
        try {
            const body = req.body;
            const d = new Date();

            const assignment = await db.assignments.create({
                name: body.name,
                points: body.points,
                num_of_attemps: body.num_of_attemps,
                deadline: body.deadline,
                account_created: d.toString(),
                account_updated: d.toString(),
                owner: req.userid
            });

            const assignJson = assignment.toJSON({ raw: true });
            delete assignJson.owner;
            return res.status(201).json(assignJson);
        } catch (err) {
            logger.error(err);
            return res.status(400).json();
        }
    }
};

const getAssignmentByid = (db) => {
    return async (req, res) => {
        try {
            const assignment = await db.assignments.findOne({
                where: { id: req.params.id }
            });

            if (!assignment) {
                logger.info(`Can't find assignment ${req.params.id}`);
                return res.status(404).json();
            }

            if (assignment.owner != req.userid) {
                logger.info(`Not the assignment (${req.params.id}) owner (${req.userid})`);
                return res.status(403).json();
            }

            const assignJson = assignment.toJSON({ raw: true });
            delete assignJson.owner;
            return res.status(200).json(assignJson);
        } catch (err) {
            logger.error(err);
            return res.status(400).json();
        }
    }
};

const delAssignmentByid = (db) => {
    return async (req, res) => {
        try {
            if (!req.params.id) {
                logger.info(`Don't have a assignment id`);
                return res.status(404).json();
            }

            const assignment = await db.assignments.findOne({
                where: { id: req.params.id }
            });
            if (!assignment) {
                logger.info(`Can't find assignment ${req.params.id}`);
                return res.status(404).json();
            }
            if (assignment.owner != req.userid) {
                logger.info(`Not the assignment (${req.params.id}) owner (${req.userid})`);
                return res.status(403).json();
            }

            await assignment.destroy();
            return res.status(204).json();
        } catch (err) {
            logger.error(err);
            return res.status(400).json();
        }
    }
};

const putAssignmentByid = (db) => {
    return async (req, res) => {
        try {
            const body = req.body;
            if (!req.params.id) {
                logger.info(`Don't have a assignment id`);
                return res.status(404).json();
            }

            const assignment = await db.assignments.findOne({
                where: { id: req.params.id }
            });
            if (!assignment) {
                logger.info(`Can't find assignment ${req.params.id}`);
                return res.status(404).json();
            }
            if (assignment.owner != req.userid) {
                logger.info(`Not the assignment (${req.params.id}) owner (${req.userid})`);
                return res.status(403).json();
            }

            const d = new Date();
            assignment.name = body.name;
            assignment.points = body.points;
            assignment.num_of_attemps = body.num_of_attemps;
            assignment.deadline = body.deadline;
            assignment.account_updated = d.toString();
            await assignment.save();
            return res.status(204).json();
        } catch (err) {
            logger.error(err);
            return res.status(400).json();
        }
    }
};

const postSubmissions = (db) => {
    return async (req, res) => {
        try {
            if (!req.params.id) {
                logger.info(`Don't have a assignment id`);
                return res.status(404).json();
            }

            const body = req.body;
            const assignment = await db.assignments.findOne({
                where: { id: req.params.id }
            });
            if (!assignment) {
                logger.info(`Can't find assignment ${req.params.id}`);
                return res.status(404).json();
            }

            const d = new Date();
            const deadline = Date.parse(assignment.deadline);
            if (d > deadline) {
                logger.info(`Deadline (${assignment.deadline}) for assignment ${req.params.id} has passed.`);
                return res.status(403).json();
            }

            const submissions = await db.submissions.findAll({
                where: { assignment_id: req.params.id, user_id: req.userid }
            });
            if (submissions.length >= assignment.num_of_attemps) {
                logger.info(`User exceeds retries ${assignment.num_of_attemps} assignment ${req.params.id}.`);
                return res.status(403).json();
            }

            const newSubmission = await db.submissions.create({
                submission_url: body.submission_url,
                submission_date: d.toString(),
                submission_updated: d.toString(),
                user_id: req.userid,
                assignment_id: req.params.id
            });

            const snsMessage = JSON.stringify({
                "email": req.userEmail,
                "submission_url": body.submission_url
            });
            sns.publishToSNS(snsMessage);

            const newSubJson = newSubmission.toJSON({ raw: true });
            delete newSubJson.user_id;
            return res.status(201).json(newSubJson);
        } catch (err) {
            logger.error(err);
            return res.status(400).json();
        }
    }
};

module.exports = {
    getAssignments,
    getAssignmentByid,
    postAssignments,
    delAssignmentByid,
    putAssignmentByid,
    postSubmissions
};