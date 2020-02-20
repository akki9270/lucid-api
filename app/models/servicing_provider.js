module.exports = function (Sequelize, Types) {
    let Servicing_Provider = Sequelize.define('Servicing_Provider', {
        servicing_provider_id: { type: Types.STRING, unique: true, primaryKey: true },
        name: { type: Types.STRING },
        address: { type: Types.STRING },
        city: { type: Types.STRING },
        state: { type: Types.STRING },
        zipcode: { type: Types.STRING },
        phone_number: { type: Types.STRING },
        fax: { type: Types.STRING },
        referral_type: { type: Types.STRING },
        referral_method: { type: Types.STRING }
    }, {
        tableName: 'Servicing_Provider',
        modelName: 'Servicing_Provider',
        timestamps: true,
        paranoid: true
    });

    Servicing_Provider.associate = function (models) {
        // models.Servicing_Provider.belongsTo(models.Service, {
        //     foreignKey: 'servicing_provider_id',
        //     targetKey: 'servicing_provider'
        // });
    }
    return Servicing_Provider;
}