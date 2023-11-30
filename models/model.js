module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define("account", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            unique: true
        }
    }, {
        createdAt: 'account_created',
        updatedAt: 'account_updated'
    });

    const Assignment = sequelize.define("assignment", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING
        },
        points: {
            type: Sequelize.INTEGER,
            validate: {
                min: 1,
                max: 100
            }
        },
        num_of_attemps: {
            type: Sequelize.INTEGER,
            validate: {
                min: 1,
                max: 100
            }
        },
        deadline: {
            type: Sequelize.STRING
        }
    }, {
        createdAt: 'assignment_created',
        updatedAt: 'assignment_updated'
    });

    const Submission = sequelize.define("submission", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        submission_url: {
            type: Sequelize.STRING
        },
        user_id: {
            type: Sequelize.STRING
        },
        assignment_id: {
            type: Sequelize.STRING
        }
    }, {
        createdAt: 'submission_date',
        updatedAt: 'submission_updated'
    });

    Account.hasMany(Assignment, { foreignKey: 'owner' });
    return { Account, Assignment, Submission };
};