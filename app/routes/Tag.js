const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { UNAUTHORIZED, SERVER_ERROR, SUCCESS } } = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;

async function getTags(req, res, next) {
    // let logData = { method: 'getTags' };
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};    
    logData.user = req.headers.user ? req.headers.user : undefined
    logData.method = 'getTags';
    logData.page = 'Patients --> F11 Notes';    
    TIMELOGGER.info(`Comment: Entry`, { ...logData });
    try {
        let tags = await models.Tag.findAll();
        return res.status(SUCCESS).send(tags);
    } catch (error) {
        TIMELOGGER.info(`getTags Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}

module.exports = { getTags }