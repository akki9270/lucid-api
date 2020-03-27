
module.exports = function (Sequelize, Types) {
    let upload_schedule = Sequelize.define('upload_schedule', {
        id: { type: Types.INTEGER, primaryKey: true, autoIncrement: true },
        status: { type: Types.TEXT },
        code: { type: Types.STRING },
        createdAt: {
            allowNull: false,
            type: Types.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            allowNull: false,
            type: Types.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        },
        deletedAt: {
            allowNull: true,
            type: Types.DATE
        }
    }, {
        tableName: 'upload_schedule',
        modelName: 'upload_schedule',
        // to have table trigger for createdAt and updatedAt to work on raw queries
        timestamps: false,

        // Will Not work if timestamps is false
        // paranoid: true
    });

    return upload_schedule;
}