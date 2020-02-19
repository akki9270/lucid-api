module.exports = function (Sequelize, Types) {
    let Physician = Sequelize.define('Physician', {
        physian_id: { type: Types.STRING },
        name: { type: Types.STRING },
        address: { type: Types.STRING },
        city: { type: Types.STRING },
        state: { type: Types.STRING },
        zipcode: { type: Types.INTEGER },
        phone_number: { type: Types.INTEGER },
        fax: { type: Types.INTEGER }
    }, {
        tableName: 'Physician',
        modelName: 'Physician',
        // freezeTableName: true,
        timestamps: true,
        paranoid: true,
    });

    Physician.associate = function (models) {
        models.Physician.belongsTo(models.Patient, {
            as: 'Physician',
            foreignKry: 'patient_id',
            targetKey: 'patient_id'
        })
    }
    return Physician;
}