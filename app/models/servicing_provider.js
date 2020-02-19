module.exports = function (Sequelize, Types) {
    let Servicing_Provider = Sequelize.define('Servicing_Provider', {
        servicing_provider_id: { type: Types.STRING },
        name: { type: Types.STRING },
        address: { type: Types.STRING },
        city: { type: Types.STRING },
        state: { type: Types.STRING },
        zipcode: { type: Types.INTEGER },
        phone_number: { type: Types.INTEGER },
        fax: { type: Types.INTEGER },
        referral_type: { type: Types.STRING },
        referral_method: { type: Types.STRING }
    }, {
        tableName: 'Servicing_Provider',
        modelName: 'Servicing_Provider',
        timestamps: true,
        paranoid: true
    });

    Servicing_Provider.associate = function (models) {
        models.Servicing_Provider.belongsTo(models.Patient, {
            as: 'Servicing_Provider',
            foreignKry: 'patient_id',
            targetKey: 'patient_id'
        });
    }
    return Servicing_Provider;
}