const db = require('../models/index');
const initialModelSqlServer = require('../models/initial-models');
const models = initialModelSqlServer(db);

async function getAllAccounts() {
    const accounts = await models.ACCOUNT.findAll({
        attributes: ['ACCOUNT_ID', 'USERNAME', 'PASSWORD', 'ROLE_ID'],
    })

    const data = accounts.map(item => {
        const { ACCOUNT_ID, USERNAME, PASSWORD, ROLE_ID } = item;
        return {
            ACCOUNT_ID,
            USERNAME,
            PASSWORD,
            ROLE_ID,
        };
    })

    return data;
}

module.exports = { getAllAccounts };