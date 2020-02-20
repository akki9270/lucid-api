
module.exports = function (Sequelize, Types) {
    let Patient = Sequelize.define('Patient', {
        patient_id: { type: Types.STRING, unique: true, primaryKey: true },
        intake_id: { type: Types.STRING },
        first_name: { type: Types.STRING },
        last_name: { type: Types.STRING },
        health_plan: { type: Types.STRING },
        days_to_soc: { type: Types.INTEGER },
        dob: { type: Types.DATE },
        gender: { type: Types.STRING },
        phone_number: { type: Types.INTEGER },
        address: { type: Types.STRING },
        city: { type: Types.STRING },
        state: { type: Types.STRING },
        zipcode: { type: Types.INTEGER },
        insurance_name: { type: Types.STRING },
        subscriber_id: { type: Types.STRING }
    }, {
        tableName: 'Patient',
        modelName: 'Patient',
        // freezeTableName: true,
        timestamps: true,
        paranoid: true
    });

    Patient.associate = function(models) {
        models.Patient.hasOne(models.Key_Indicator, {
            as: 'key_indicator',
            foreignKey: 'patient_id'
        });
        models.Patient.hasMany(models.Service, {
            as: 'service',
            foreignKey: 'patient_id'
        });
    }
    return Patient;
}