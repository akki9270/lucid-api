module.exports = function (Sequelize, Types) {
    let users = Sequelize.define('Users', {
        user_id: { type: Types.INTEGER, primaryKey: true },
        first_name: { type: Types.STRING},
        last_name: { type: Types.STRING},
        email: { type: Types.STRING },
        password: { type: Types.STRING },
        isAdmin: { type: Types.BOOLEAN }
    }, {
        tableName: 'Users',
        modelName: 'Users',
        // freezeTableName: true,
        timestamps: true,
        paranoid: true,
        classMethods: {
            // eslint-disable-next-line
        }
    });

    return users;
}