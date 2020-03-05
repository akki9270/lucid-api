const crypto = require('crypto');

module.exports = function (Sequelize, Types) {
    let users = Sequelize.define('Users', {
        user_id: { type: Types.STRING, primaryKey: true },
        first_name: { type: Types.STRING },
        last_name: { type: Types.STRING },
        email: { type: Types.STRING },
        password: { type: Types.STRING },
        password_hash: { type: Types.STRING },
        password_salt: { type: Types.STRING },
        is_admin: { type: Types.BOOLEAN },
        is_active: { type: Types.BOOLEAN, defaultValue: true },
        updatedBy: { type: Types.STRING }
    }, {
        tableName: 'Users',
        modelName: 'Users',
        // freezeTableName: true,
        timestamps: true,
        paranoid: true,
        classMethods: {
            // eslint-disable-next-line
        },
        hooks: {
            // eslint-disable-next-line
            beforeCreate: function (user, options) {
                let password = user.password;
                let salt = users.genRandomString(16);
                let hash = users.sha512(password, salt);
                user.password = null;
                user.password_hash = hash.passwordHash;
                user.password_salt = salt;
            }
        }
    });

    /**
   * generates random string of characters i.e salt
   * @function
   * @param {number} length - Length of the random string.
   */
    users.genRandomString = function (length) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);   /** return required number of characters */
    }
    /**
     * hash password with sha512.
     * @function
     * @param {string} password - List of required fields.
     * @param {string} salt - Data to be validated.
    */
    users.sha512 = function (password, salt) {
        var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
        hash.update(password);
        var value = hash.digest('hex');
        return {
            salt: salt,
            passwordHash: value
        };
    };
    return users;
}