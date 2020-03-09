
module.exports = function (Sequelize, Types) {
    let Tag = Sequelize.define('Tag', {
        tag_code: { type: Types.STRING, primaryKey: true },
        tag_name: { type: Types.STRING },
        tag_color: { type: Types.STRING },
    }, {
        tableName: 'Tag',
        modelName: 'Tag',
        timestamps: true,
        paranoid: true
    });

    return Tag;
}