class SiteController {

    //[GET] /api/site/home
    home(req, res, next) {
        res.render('site/home');
    }
}

module.exports = new SiteController();