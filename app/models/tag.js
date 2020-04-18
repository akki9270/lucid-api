
module.exports = function (Sequelize, Types) {
    let Tag = Sequelize.define('Tag', {
        tag_code: { type: Types.STRING, primaryKey: true },
        tag_name: { type: Types.STRING },
        associate_tag: { type: Types.STRING },
        tag_color: { type: Types.STRING },
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
        tableName: 'Tag',
        modelName: 'Tag',
        timestamps: false,
        paranoid: true
    });

    return Tag;
}