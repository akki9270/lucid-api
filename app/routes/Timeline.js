const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { SERVER_ERROR, SUCCESS } } = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;

// eslint-disable-next-line
async function getTimeline(req, res, next) {    
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.method = 'getTimeline';
    logData.page = 'Patients --> Timeline';    
    TIMELOGGER.info(`Comment: Entry, params: ${JSON.stringify(req.params)}`, { ...logData });
    let pathParams = req.params;
    let patientId = '';
    let intakeId = '';
    let whereClause = {};
    if (pathParams && pathParams.patientId) {
        patientId = pathParams.patientId;
    }
    if (pathParams && pathParams.intakeId) {
        intakeId = pathParams.intakeId;
    }
    if (patientId) {
        whereClause = {
            ...whereClause,
            patient_id: { [Sequelize.Op.eq]: patientId }
        }
    }
    if (intakeId) {
        whereClause = {
            ...whereClause,
            intake_id: { [Sequelize.Op.eq]: intakeId }
        }
    }
    try {
        let timelines = await models.Timeline.findAll({
            where: whereClause
        });
        return res.status(SUCCESS).send(timelines);
    } catch (error) {
        TIMELOGGER.error(`getTimeline Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}


// module.exports = function (Sequelize, Types) {
//     let Timeline = Sequelize.define('Timeline', {
//         event_name: { type: Types.STRING },
//         datetime: { type: Types.DATE } 
//     }, {
//         tableName: 'Timeline',
//         modelName: 'Timeline',
//         // freezeTableName: true,
//         timestamps: true,
//         paranoid: true,
//         classMethods: {
//             // eslint-disable-next-line
//         }
//     });

//     Timeline.associate = function (models) {
//         models.Timeline.belongsTo(models.Patient, {
//             as: 'patient',
//             foreignKey: 'patient_id',
//             targetKey: 'patient_id'
//         });
//         models.Timeline.belongsTo(models.Patient, {
//             as: 'intake',
//             foreignKey: 'intake_id',
//             targetKey: 'intake_id'
//         });
//         models.Service.belongsTo(models.Notes, {
//             as: 'notes',
//             foreignKey: 'note_id',
//             targetKey: 'note_id'
//         });
//     }

//     return Timeline;
// }

module.exports = { getTimeline }