const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { UNAUTHORIZED, SERVER_ERROR, SUCCESS } } = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;

async function getPatients(req, res, next) {
    let logData = { method: 'getPatients' };
    let pathParams = req.params;
    let patientId = '';
    let whereClause = {};
    if (pathParams && pathParams.patientId) {
        patientId = pathParams.patientId;
    }
    if (patientId) {
        whereClause = {
            ...whereClause,
            patient_id: { [Sequelize.Op.eq]: patientId }
        }
    }
    try {
        let patients = await models.Patient.findAll({
            where: {...whereClause},
            order: [
                ['last_seen', 'DESC'],
            ],
            include: [
                {
                    model: models.Key_Indicator,
                    as: 'key_indicator'
                },
                {
                    model: models.Service,
                    as: 'service'                    
                }
            ],
            limit: 10
        });
        return res.status(SUCCESS).send(patients);
    } catch (error) {
        TIMELOGGER.info(`getPatients Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}




module.exports = { getPatients }