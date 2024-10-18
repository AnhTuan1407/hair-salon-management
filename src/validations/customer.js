module.exports.customerValidation = function (req, res, next) {
    if (!req.body.name) {
        req.flash("error", `Tên không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.email) {
        req.flash("error", `Email không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.phone) {
        req.flash("error", `Số điện thoại không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.address) {
        req.flash("error", `Địa chỉ không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.gender) {
        req.flash("error", `Giới tính không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.dateOfBirth) {
        req.flash("error", `Ngày sinh không được để trống!`);
        res.redirect("back");
        return;
    }

    next();
}