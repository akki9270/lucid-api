module.exports = function (Sequelize, Types) {
    let Timeline = Sequelize.define('Timeline', {
        event_name: { type: Types.STRING },
        datetime: { type: Types.DATE } 
    }, {
        tableName: 'Timeline',
        modelName: 'Timeline',
        // freezeTableName: true,
        timestamps: true,
        paranoid: true,
        classMethods: {
            // eslint-disable-next-line
        }
    });

    Timeline.associate = function (models) {
        models.Service.belongsTo(models.Patient, {
            as: 'patient',
            foreignKey: 'patient_id',
            targetKey: 'patient_id'
        });
        models.Service.belongsTo(models.Patient, {
            as: 'intake',
            foreignKey: 'intake_id',
            targetKey: 'intake_id'
        });
        models.Service.belongsTo(models.Notes, {
            as: 'notes',
            foreignKey: 'note_id',
            targetKey: 'note_id'
        });
    }

    return Timeline;
}