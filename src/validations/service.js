module.exports.createValidation = (req, res, next) => {
    if (!req.body.name) {
        req.flash("error", `Tên dịch vụ không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.description) {
        req.flash("error", `Mô tả dịch vụ không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.price) {
        req.flash("error", `Giá dịch vụ không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.estimateTime) {
        req.flash("error", `Thời gian dịch vụ không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.file) {
        req.flash("error", `Hình ảnh dịch vụ không được để trống!`);
        res.redirect("back");
        return;
    }

    if (isNaN(req.body.price)) {
        req.flash("error", `Giá dịch vụ phải là số!`);
        res.redirect("back");
        return;
    }

    if (isNaN(req.body.estimateTime)) {
        req.flash("error", `Số giờ dịch vụ phải là số!`);
        res.redirect("back");
        return;
    }

    next();
}

module.exports.editValidation = (req, res, next) => {
    if (!req.body.name) {
        req.flash("error", `Tên dịch vụ không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.description) {
        req.flash("error", `Mô tả dịch vụ không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.price) {
        req.flash("error", `Giá dịch vụ không được để trống!`);
        res.redirect("back");
        return;
    }

    if (!req.body.estimateTime) {
        req.flash("error", `Thời gian dịch vụ không được để trống!`);
        res.redirect("back");
        return;
    }
    next();
}