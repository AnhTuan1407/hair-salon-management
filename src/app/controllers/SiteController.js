const db = require('../models/index');
const initialModelSqlServer = require('../models/initial-models');
const models = initialModelSqlServer(db);
class SiteController {

    //[GET] /api/site/home
    async home(req, res, next) {
        try {
            const services = await models.SERVICE.findAll({});

            res.render('site/home', {
                title: "Trang chủ",
                services: services,
            });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }
}

module.exports = new SiteController();