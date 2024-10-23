const customerRouter = require('./customer');
const staffRouter = require('./staff');
const accountRouter = require('./account');
const siteRouter = require('./site');
const serviceRouter = require('./service');
const notificationRouter = require('./notification');

function router(app) {
    app.use('/api/customers', customerRouter);
    app.use('/api/staff', staffRouter);
    app.use('/api/accounts', accountRouter);
    app.use('/api/site', siteRouter);
    app.use('/api/services', serviceRouter);
    app.use('/api/notifications', notificationRouter);
}

module.exports = router;