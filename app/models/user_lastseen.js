
module.exports = function (Sequelize, Types) {
    let UserLastseen = Sequelize.define('UserLastseen', {                
        last_seen: { type: Types.DATE }        
    }, {
        tableName: 'UserLastseen',
        modelName: 'UserLastseen',
        timestamps: true,
        paranoid: true
    });

    UserLastseen.associate = function (models) {       
        // models.UserLastseen.belongsTo(models.Patient, {
        //     as: 'patient',
        //     foreignKey: 'row_id',
        //     targetKey: 'row_id'
        // });
        models.UserLastseen.belongsTo(models.Users, {
            as: 'user',
            foreignKey: 'user_id',
            targetKey: 'user_id'
        });
    }

    return UserLastseen;
}