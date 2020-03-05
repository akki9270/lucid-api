const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { UNAUTHORIZED, SERVER_ERROR, SUCCESS } } = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;

async function getUsers(req, res, next) {
    let logData = { method: 'getUsers' };
    // let pathParams = req.params;
    // let patientId = '';
    let whereClause = { isAdmin: { [Sequelize.Op.eq]: false } };
    // if (pathParams && pathParams.patientId) {
    //     patientId = pathParams.patientId;
    // }
    // if (patientId) {
    //     whereClause = {
    //         ...whereClause,
    //         patient_id: { [Sequelize.Op.eq]: patientId }
    //     }
    // }
    try {
        let users = await models.Users.findAll({
            where: {...whereClause}
        });
        return res.status(SUCCESS).send(users);
    } catch (error) {
        TIMELOGGER.info(`getUsers Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}




module.exports = { getUsers }