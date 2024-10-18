const db = require('../models/index');
const initialModelSqlServer = require('../models/initial-models');
const models = initialModelSqlServer(db);


async function getAllStaff() {
    try {
        const staff = await models.STAFF.findAll({
            attributes: ['STAFF_ID', 'NAME', 'EMAIL', 'GENDER', 'ADDRESS', 'PHONE', 'ROLE', 'RATING', 'ACCOUNT_ID', 'LOCATION_ID'],
        });

        const data = staff.map(item => ({
            STAFF_ID: item.STAFF_ID,
            NAME: item.NAME,
            EMAIL: item.EMAIL,
            GENDER: item.GENDER,
            ADDRESS: item.ADDRESS,
            PHONE: item.PHONE,
            ROLE: item.ROLE,
            RATING: item.RATING,
            ACCOUNT_ID: item.ACCOUNT_ID,
            LOCATION_ID: item.LOCATION_ID,
        }));

        return data;

    } catch (error) {
        console.log('>>> No staff found');
        return [];
    }
}


module.exports = { getAllStaff }

