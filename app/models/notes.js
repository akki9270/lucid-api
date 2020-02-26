module.exports = function (Sequelize, Types) {
    let Notes = Sequelize.define('Notes', {
        note_id: { type: Types.STRING, primaryKey: true },
        note_data: { type: Types.STRING }      
    }, {
        tableName: 'Notes',
        modelName: 'Notes',
        // freezeTableName: true,
        timestamps: true,
        paranoid: true,
        classMethods: {
            // eslint-disable-next-line
        }
    });

    Notes.associate = function (models) {
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
    }

    return Notes;
}