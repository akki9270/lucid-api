const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { SERVER_ERROR, SUCCESS } } = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;

// eslint-disable-next-line
async function getNotes(req, res, next) {        
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.method = 'getNotes';
    logData.page = 'Patients --> F11 Notes';    
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
        let notes = await models.Notes.findAll({ where: whereClause });
        return res.status(SUCCESS).send(notes);
    } catch (error) {
        TIMELOGGER.error(`getNotes Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}




module.exports = { getNotes }