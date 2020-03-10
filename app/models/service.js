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
        primary_physician_name: { type: Types.STRING },
        primary_physician_first_name: { type: Types.STRING },
        primary_physician_last_name: { type: Types.STRING },
        primary_physician_address: { type: Types.STRING },
        primary_physician_city: { type: Types.STRING },
        primary_physician_state: { type: Types.STRING },
        primary_physician_zipcode: { type: Types.STRING },
        primary_physician_phone_number: { type: Types.STRING },
        primary_physician_fax: { type: Types.STRING },
        ordering_physician_name: { type: Types.STRING },
        ordering_physician_first_name: { type: Types.STRING },
        ordering_physician_last_name: { type: Types.STRING },
        ordering_physician_address: { type: Types.STRING },
        ordering_physician_city: { type: Types.STRING },
        ordering_physician_state: { type: Types.STRING },
        ordering_physician_zipcode: { type: Types.STRING },
        ordering_physician_phone_number: { type: Types.STRING },
        ordering_physician_fax: { type: Types.STRING },
        service_provider_name: { type: Types.STRING },
        service_provider_address: { type: Types.STRING },
        service_provider_city: { type: Types.STRING },
        service_provider_state: { type: Types.STRING },
        service_provider_zipcode: { type: Types.STRING },
        service_provider_phone_number: { type: Types.STRING },
        service_provider_fax: { type: Types.STRING },
        service_provider_referral_type: { type: Types.STRING },
        service_provider_referral_method: { type: Types.STRING },
        // patient_id: { type: Types.STRING, references: { model: 'patient', key: 'patient_id' } },
        // intake_id: { type: Types.STRING, references: { model: 'patient', key: 'intake_id' }  }
    }, {
        tableName: 'Service',
        modelName: 'Service',
        timestamps: true,
        paranoid: true,
        hooks: {
            // eslint-disable-next-line
            beforeCreate: function (service, options) {
                if (service.primary_physician_name && service.primary_physician_name.indexOf(' ')) {
                    service.primary_physician_first_name = service.primary_physician_name.split(' ')[0];
                    service.primary_physician_last_name = service.primary_physician_name.split(' ')[1];
                }
                if (service.ordering_physician_name && service.ordering_physician_name.indexOf(' ')) {
                    service.ordering_physician_first_name = service.ordering_physician_name.split(' ')[0];
                    service.ordering_physician_last_name = service.ordering_physician_name.split(' ')[1];
                }
            }
        }
    });
    Service.associate = function (models) {
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
        // models.Service.belongsTo(models.Servicing_Provider, {
        //     as: 'servicingProvider',
        //     foreignKey: 'servicing_provider',
        //     targetKey: 'servicing_provider_id'
        // });
        // models.Service.belongsTo(models.Physician, {
        //     as: 'orderingPhysician',
        //     foreignKey: 'ordering_physician',
        //     targetKey: 'physician_id'
        // });
        // models.Service.belongsTo(models.Physician, {
        //     as: 'primaryPhysician',
        //     foreignKey: 'primary_physician',
        //     targetKey: 'physician_id'
        // });
    };
    return Service;
}