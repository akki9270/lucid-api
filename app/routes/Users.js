const models = require('../models');
const Sequelize = require('sequelize');
const { STATUS_CODES: { UNAUTHORIZED, SERVER_ERROR, SUCCESS } } = require('../http_util');
const HTTP_UTIL = require('../http_util');
const TIMELOGGER = require('../winston').TIMELOGGER;
const jwt = require('jsonwebtoken');
const config = require('../config');

async function getUsers(req, res, next) {
    let logData = { method: 'getUsers' };
    // let pathParams = req.params;
    // let patientId = '';
    let whereClause = {};
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
            where: { ...whereClause }
        });
        return res.status(SUCCESS).send(users);
    } catch (error) {
        TIMELOGGER.info(`getUsers Err:  ${error.message}`, ...logData)
        return res.status(SERVER_ERROR).send();
    }
}

async function addUser(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};
    logData.method = 'addUser';
    TIMELOGGER.info(`params: ${JSON.stringify(req.body)}`,{...logData});
    let data = req.body;
    let { id, first_name, last_name, password, user } = data;
    try {
        let existingUser = await models.Users.findOne({where: {user_id: id}}, {raw: true});
        // console.log('existingUser ', existingUser);
        if (existingUser) {
            TIMELOGGER.warn(`data: Existing User ${existingUser}`,{...logData});
            return res.status(500).send('User Already Exists with Same USER ID.')
        }
        let result = await models.Users.create({user_id: id, password, first_name, last_name, updatedBy: user.id});
        // if (result) {
            res.status(SUCCESS).send(result);
        // } else {
        //     timelogger.error(`user: ${id} method:  app/routes/userRoutes/addUser`);
        //     res.status(SERVER_ERROR).send('SERVER_ERROR');
        // }
    } catch (err) {
        TIMELOGGER.error(`Error: ${err.message}`,{...logData});
        res.status(SERVER_ERROR).send(err.message);
    }
}

async function updateUser(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};
    logData.method = 'updateUser';
    timelogger.info(`params: ${JSON.stringify(req.body)}`,{...logData});
    let data = req.body;
    let { id, first_name, last_name, password, is_admin, user } = data;
    let result;
    try {
        if (data.newPassword) {
            let existingUser = await models.Assignee.findOne({ where: { user_id: id } });
            let hash = models.Assignee.sha512(password, existingUser.password_salt);
            if (hash.passwordHash !== existingUser.password_hash) {
                return res.status(SERVER_ERROR).send('Current Password Wrong.');
            } else {
                password = data.newPassword;
            }
        }
        if (password) {
            let salt = models.Assignee.genRandomString(16);
            let hash = models.Assignee.sha512(password, salt);
            let password_hash = hash.passwordHash;
            result = await models.Assignee.update( {
                password_hash,
                password_salt: salt,
                updatedBy: user.id,
                updatedAt: models.sequelize.literal('CURRENT_TIMESTAMP')
            },{ where: {user_id: id}});
        } else {
            result = await models.Assignee.update({name, is_admin, updatedBy: user.id}, {
                where: {user_id: id}
            });
        }
        
        // if (result) {
            res.status(SUCCESS).send(result);
        // } else {
        //     timelogger.error(`method: app/routes/userRoutes/updateUser`);
        //     timelogger.error(`user: ${user.id} user to update: ${id}`);
        //     res.status(SERVER_ERROR).send('SERVER_ERROR');
        // }
    } catch (err) {
        timelogger.error(`Error: ${err.message}`,{...logData});
        res.status(SERVER_ERROR).send(err.message);
    }
}

async function toggleActiveUser(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};
    logData.method = 'toggleActiveUser';
    TIMELOGGER.info(`params: ${JSON.stringify(req.body)}`,{...logData});
    let data = req.body;
    let { id, is_active, user } = data;
    try {
        let result = await models.Users.update({is_active, updatedBy: user.id}, {
            where: {user_id: id}
        });
        // if (result) {
            res.status(SUCCESS).send(result);
        // } else {
        //     timelogger.error(`user: ${user.id} user to update: ${id}`);
        //     res.status(SERVER_ERROR).send('SERVER_ERROR');
        // }
    } catch (err) {
        TIMELOGGER.error(`Error: ${err.message}`,{...logData});
        res.status(SERVER_ERROR).send(err.message);
    }
}

async function toggleAdminUser(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};
    logData.method = 'toggleAdminUser';
    TIMELOGGER.info(`params: ${JSON.stringify(req.body)}`,{...logData});
    let data = req.body;
    let { id, is_admin, user } = data;
    try {
        let result = await models.Users.update({is_admin, updatedBy: user.id}, {
            where: {user_id: id}
        });
        // if (result) {
            res.status(SUCCESS).send(result);
        // } else {
        //     timelogger.error(`user: ${user.id} user to update: ${id}`);
        //     res.status(SERVER_ERROR).send('SERVER_ERROR');
        // }
    } catch (err) {
        TIMELOGGER.error(`Error: ${err.message}`,{...logData});
        res.status(SERVER_ERROR).send(err.message);
    }
}

async function login(req, res, next) {
    let logData = req.headers.log_data ? JSON.parse(req.headers.log_data) : {};
    logData.method = 'login';
    TIMELOGGER.info(`Entry: `, { ...logData });
    let { ERROR_MESSAGE: { PASSWORD_INCORRECT, USER_NOT_FOUND }, STATUS_CODES: { NOT_FOUND, UNAUTHORIZED, SERVER_ERROR } } = HTTP_UTIL;
    const { user_id, password } = req.body;
    try {
        let user = await models.Users.findOne({ where: { user_id: user_id, is_active: true } })
        if (!user) {
            TIMELOGGER.warn(`comment: ${USER_NOT_FOUND}`,{...logData});
            return res.status(USER_NOT_FOUND).send({ message: USER_NOT_FOUND });
        }
        let hash = models.Users.sha512(password, user.password_salt);
        if (hash.passwordHash === user.password_hash) {
            // from now on we'll identify the user by the id and the id is
            // the only personalized value that goes into our token
            let payload = { id: user.user_id, password: user.password_hash };
            let token = jwt.sign(payload, config.SECRET);
            let data = {
                id: user.user_id,
                is_admin: user.is_admin,
                name: user.name,
                first_name: user.first_name,
                last_name: user.last_name
            }
            logData.user = data.id;
            // UserLoginStatus[data.id] = true
            TIMELOGGER.info(`comment: Logged In`,{...logData}); 
           return res.status(SUCCESS).send({ message: 'ok', token: token, user: data })
        } else {
        //    console.log('else');
           TIMELOGGER.warn(`comment: ${PASSWORD_INCORRECT}`,{...logData}); 
           return res.status(UNAUTHORIZED).send({ message: PASSWORD_INCORRECT});
            // return res.status(401).json({ msg: 'Password is incorrect' });
        }
    } catch (err) {
        TIMELOGGER.error(`Error: ${err.message}`,{...logData});
        return res.status(SERVER_ERROR).send(err.message);
    }
}




module.exports = { getUsers, addUser, updateUser, toggleActiveUser, toggleAdminUser ,login }