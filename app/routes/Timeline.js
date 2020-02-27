const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { UNAUTHORIZED, SERVER_ERROR, SUCCESS } } = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;

async function getTimeline(req, res, next) {    
    let logData = { method: 'getTimeline' };
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
        TIMELOGGER.info(`getTimeline Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}




module.exports = { getTimeline }