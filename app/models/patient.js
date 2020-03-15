
module.exports = function (Sequelize, Types) {
    let Patient = Sequelize.define('Patient', {
        // row_id: { type: Types.INTEGER },
        patient_id: { type: Types.STRING, primaryKey: true },
        intake_id: { type: Types.STRING, primaryKey: true },
        first_name: { type: Types.STRING },
        last_name: { type: Types.STRING },
        // health_plan: { type: Types.STRING },
        // days_to_soc: { type: Types.INTEGER },
        dob: { type: Types.DATE },
        gender: { type: Types.STRING },
        phone_number: { type: Types.STRING },
        address: { type: Types.STRING },
        city: { type: Types.STRING },
        state: { type: Types.STRING },
        zipcode: { type: Types.STRING },
        insurance_name: { type: Types.STRING },
        subscriber_id: { type: Types.STRING },
        last_seen: { type: Types.DATE },
        pediatric_patient: { type: Types.BOOLEAN },
        call_frequency: { type: Types.ENUM('DAY', 'WEEK', 'MONTH', 'YEAR') },
        call_count: { type: Types.INTEGER },
        urgent: { type: Types.BOOLEAN },
        escalation: { type: Types.BOOLEAN },
        restaff_turnback: { type: Types.BOOLEAN },
        primary_care_physician: { type: Types.BOOLEAN },
        ordering_physician: { type: Types.BOOLEAN },
        wound_care: { type: Types.BOOLEAN },
        facility_discharge: { type: Types.BOOLEAN },
        patient_id: { type: Types.STRING, primaryKey: true },
        intake_id: { type: Types.STRING, primaryKey: true }
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
        models.Patient.hasMany(models.Service, {
            as: 'service',
            foreignKey: 'patient_id'
        });
        models.Patient.hasMany(models.UserLastseen, {
            as: 'userLastSeen',
            foreignKey: 'patient_id'
        })
    }
    return Patient;
}