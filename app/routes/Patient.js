const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { UNAUTHORIZED, SERVER_ERROR, SUCCESS } } = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;

async function getPatients(req, res, next) {
    let logData = { method: 'getPatients' };
    try {
        let patients = await models.Patient.findAll({
            include: [
                {
                    model: models.Key_Indicator,
                    as: 'key_indicator'
                },
                {
                    model: models.Service,
                    as: 'service',
                    include: [
                        {
                            model: models.Servicing_Provider,
                            as: 'servicingProvider'
                        },
                        {
                            model: models.Physician,
                            as: 'orderingPhysician'
                        },
                        {
                            model: models.Physician,
                            as: 'primaryPhysician'
                        }
                    ]
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