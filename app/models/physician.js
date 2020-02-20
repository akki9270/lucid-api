module.exports = function (Sequelize, Types) {
    let Physician = Sequelize.define('Physician', {
        physician_id: { type: Types.STRING, unique: true, primaryKey: true  },
        name: { type: Types.STRING },
        address: { type: Types.STRING },
        city: { type: Types.STRING },
        state: { type: Types.STRING },
        zipcode: { type: Types.INTEGER },
        phone_number: { type: Types.INTEGER },
        fax: { type: Types.INTEGER }
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