module.exports = function (Sequelize, Types) {
    let Physician = Sequelize.define('Physician', {
        physician_id: { type: Types.STRING, unique: true, primaryKey: true  },
        name: { type: Types.STRING },
        address: { type: Types.STRING },
        city: { type: Types.STRING },
        state: { type: Types.STRING },
        zipcode: { type: Types.STRING },
        phone_number: { type: Types.STRING },
        fax: { type: Types.STRING }
    }, {
        tableName: 'Physician',
        modelName: 'Physician',
        // freezeTableName: true,
        timestamps: true,
        paranoid: true,
    });

    Physician.associate = function (models) {
        // models.Physician.belongsTo(models.Service, {
        //     foreignKey: 'physician_id',
        //     targetKey: 'ordering_physician'
        // });
        // models.Physician.belongsTo(models.Service, {
        //     foreignKey: 'physician_id',
        //     targetKey: 'primary_physician'
        // });
    }
    return Physician;
}