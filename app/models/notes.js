module.exports = function (Sequelize, Types) {
    let Notes = Sequelize.define('Notes', {
        note_id: { type: Types.STRING, primaryKey: true },
        note_data: { type: Types.TEXT },
        operation_center_code: { type: Types.STRING },
        date: { type: Types.DATE },
        nex_review_date: { type: Types.DATE },
        parsed_flag: { type: Types.TINYINT(0), defaultValue: 0 },
        createdAt: {
            allowNull: false,
            type: Types.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            allowNull: false,
            type: Types.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        },
        deletedAt: {
            allowNull: true,
            type: Types.DATE
        }
        // reviewed: { type: Types.BOOLEAN }        
    }, {
        tableName: 'Notes',
        modelName: 'Notes',
        // freezeTableName: true,
        timestamps: false,
        paranoid: true,
        classMethods: {
            // eslint-disable-next-line
        }
    });

    Notes.associate = function (models) {
        models.Notes.belongsTo(models.Patient, {
            as: 'patient',
            foreignKey: 'patient_id',
            targetKey: 'patient_id'
        });
        models.Notes.belongsTo(models.Patient, {
            as: 'intake',
            foreignKey: 'intake_id',
            targetKey: 'intake_id'
        });
    }

    return Notes;
}