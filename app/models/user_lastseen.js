
module.exports = function (Sequelize, Types) {
    let UserLastseen = Sequelize.define('UserLastseen', {                
        last_seen: { type: Types.DATE },
        user_id: { type: Types.STRING },
        patient_id: { type: Types.STRING },
        intake_id: {type: Types.STRING },
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
        tableName: 'UserLastseen',
        modelName: 'UserLastseen',
        timestamps: false,
        paranoid: true  
    });

    UserLastseen.associate = function (models) {       
        models.UserLastseen.belongsTo(models.Patient, {
            as: 'patient',
            foreignKey: 'patient_id',
            targetKey: 'patient_id'
        });
        models.UserLastseen.belongsTo(models.Patient, {
            as: 'intake',
            foreignKey: 'intake_id',
            targetKey: 'intake_id'
        });
        models.UserLastseen.belongsTo(models.Users, {
            as: 'user',
            foreignKey: 'user_id',
            targetKey: 'user_id'
        });
    }

    return UserLastseen;
}