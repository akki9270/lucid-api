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
            as: 'patient',
            foreignKey: 'patient_id',
            targetKey: 'patient_id'
        });
        models.Service.belongsTo(models.Servicing_Provider, {
            as: 'servicingProvider',
            foreignKey: 'servicing_provider',
            targetKey: 'servicing_provider_id'
        });
        models.Service.belongsTo(models.Physician, {
            as: 'orderingPhysician',
            foreignKey: 'ordering_physician',
            targetKey: 'physician_id'
        });
        models.Service.belongsTo(models.Physician, {
            as: 'primaryPhysician',
            foreignKey: 'primary_physician',
            targetKey: 'physician_id'
        });

    };
    return Service;
}