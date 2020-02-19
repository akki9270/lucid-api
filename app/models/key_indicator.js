module.exports = function (Sequelize, Types) {
    let Key_Indicator = Sequelize.define('Key_Indicator', {
        pediatric_patient: { type: Types.BOOLEAN },
        urgent: { type: Types.BOOLEAN },
        engaged_by_escalation_team: { type: Types.BOOLEAN },
        restaff_turnback: { type: Types.BOOLEAN },
        primary_care_physician: { type: Types.BOOLEAN },
        following_physician: { type: Types.BOOLEAN },
        wound_care: { type: Types.BOOLEAN },
        facility_discharge: { type: Types.BOOLEAN },
    }, {
        tableName: 'Key_Indicator',
        modelName: 'Key_Indicator',
        // freezeTableName: true,
        timestamps: true,
        paranoid: true,
        classMethods: {
            // eslint-disable-next-line
        }
    });

    Key_Indicator.associate = function (models) {
        models.Key_Indicator.belongsTo(models.Patient, {
            as: 'key_indicator',
            foreignKey: 'patient_id',
            targetKey: 'patient_id'
        });
    }

    return Key_Indicator;
}