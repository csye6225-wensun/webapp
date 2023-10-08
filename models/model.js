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
        },
        createdAt: {
            type: Sequelize.DATE,
            field: 'account_created',
        },
        updatedAt: {
            type: Sequelize.DATE,
            field: 'account_updated',
        }
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
        },
        createdAt: {
            type: Sequelize.DATE,
            field: 'assignment_created',
        },
        updatedAt: {
            type: Sequelize.DATE,
            field: 'assignment_updated',
        }
    });

    Account.hasMany(Assignment, { foreignKey: 'onwer' });
    return { Account, Assignment };
};