const customerRouter = require('./customer');
const staffRouter = require('./staff');
const accountRouter = require('./account');
const siteRouter = require('./site');

function router(app) {
    app.use('/api/customers', customerRouter);
    app.use('/api/staff', staffRouter);
    app.use('/api/accounts', accountRouter);
    app.use('/api/site', siteRouter);
}

module.exports = router;