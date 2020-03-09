
module.exports = function (Sequelize, Types) {
    let Patient = Sequelize.define('Patient', {
        row_id: { type: Types.INTEGER, primaryKey: true, autoIncrement: true },
        patient_id: { type: Types.STRING, primaryKey: true },
        intake_id: { type: Types.STRING, primaryKey: true },
        first_name: { type: Types.STRING },
        last_name: { type: Types.STRING },
        health_plan: { type: Types.STRING },
        days_to_soc: { type: Types.INTEGER },
        dob: { type: Types.DATE },
        gender: { type: Types.STRING },
        phone_number: { type: Types.STRING },
        address: { type: Types.STRING },
        city: { type: Types.STRING },
        state: { type: Types.STRING },
        zipcode: { type: Types.STRING },
        insurance_name: { type: Types.STRING },
        subscriber_id: { type: Types.STRING },
        last_seen: { type: Types.DATE }
    }, {
        tableName: 'Patient',
        modelName: 'Patient',
        // indexes: [
        //     {
        //         unique: true,
        //         fields: ['patient_id', 'intake_id']
        //     }
        // ],
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