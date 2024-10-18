
module.exports.registerPost = (req, res, next) => {
    if (!req.body.username) {
        req.flash("error", `Tên đăng nhập không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.password) {
        req.flash("error", `Mật khẩu không được để trống!`);
        res.redirect("back");
        return;
    }

    next();
}

module.exports.loginPost = (req, res, next) => {
    if (!req.body.username) {
        req.flash("error", `Tên đăng nhập không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.password) {
        req.flash("error", `Mật khẩu không được để trống!`);
        res.redirect("back");
        return;
    }

    next();
}