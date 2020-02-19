module.exports = function (Sequelize, Types) {
    let Service = Sequelize.define('Service', {
        service_code: { type: Types.STRING },
        hcpc_code: { type: Types.STRING },
        start_date: { type: Types.DATE },
        end_date: { type: Types.DATE },
        units: { type: Types.INTEGER },
        description: { type: Types.STRING },
        primary_diagnosis: { type: Types.STRING },
        ref_source: { type: Types.STRING },
        ordering_physician: { type: Types.STRING},
        primary_physician: { type: Types.STRING},
        servicing_provider: { type: Types.STRING}
    }, {
        tableName: 'Service',
        modelName: 'Service',
        timestamps: true,
        paranoid: true,
    });
    Service.associate = function (models) {
        models.Service.belongsTo(models.Patient, {
            as: 'Service',
            foreignKey: 'patient_id',
            targetKey: 'patient_id'
        });
    };
    return Service;
}