const DataTypes = require("sequelize").DataTypes;

const _CUSTOMER = require('./Customer');
const _STAFF = require('./Staff');
const _ACCOUNT = require('./Account');
const _ROLE = require('./Role');
const _LOCATION = require('./Location');
const _SERVICE = require('./Service');
const _NOTIFICATION = require('./Notification');

function initialModelSqlServer(sequelize) {
    const CUSTOMER = _CUSTOMER(sequelize, DataTypes);
    const STAFF = _STAFF(sequelize, DataTypes);
    const ACCOUNT = _ACCOUNT(sequelize, DataTypes);
    const ROLE = _ROLE(sequelize, DataTypes);
    const LOCATION = _LOCATION(sequelize, DataTypes);
    const SERVICE = _SERVICE(sequelize, DataTypes);
    const NOTIFICATION = _NOTIFICATION(sequelize, DataTypes);

    return {
        CUSTOMER,
        STAFF,
        ACCOUNT,
        ROLE,
        LOCATION,
        SERVICE,
        NOTIFICATION
    }
}

module.exports = initialModelSqlServer;