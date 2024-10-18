const db = require('../models/index');
const initialModelSqlServer = require('../models/initial-models');
const models = initialModelSqlServer(db);


async function getAllCustomers() {

    try {
        const customers = await models.CUSTOMER.findAll({
            attributes: ['CUSTOMER_ID', 'NAME', 'EMAIL', 'PHONE', 'ADDRESS', 'DATE_OF_BIRTH', 'GENDER', 'POINTS']
        });

        const data = customers.map(item => {
            const { CUSTOMER_ID, NAME, EMAIL, PHONE, ADDRESS, DATE_OF_BIRTH, GENDER, POINTS } = item;
            return {
                CUSTOMER_ID,
                NAME,
                EMAIL,
                PHONE,
                ADDRESS,
                DATE_OF_BIRTH,
                GENDER,
                POINTS
            };
        });

        return data;

    } catch (error) {
        console.log('>>> No customers found');
    };
};

module.exports = { getAllCustomers }

