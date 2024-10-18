const { getAllStaff } = require('../services/staffService');
const initialModelSqlServer = require('../models/initial-models');
const db = require('../models/index');
const models = initialModelSqlServer(db);
const { where } = require('sequelize');

class StaffController {

    //[GET] /api/staff/findAll
    async showAllStaff(req, res, next) {
        try {
            const result = await getAllStaff();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra!' });
        }
    }

    //[GET] /api/staff/create
    showCreateForm(req, res, next) {
        res.render('staff/create');
    }

    //[POST] /api/staff/create
    async doCreate(req, res, next) {
        try {
            const data = req.body;

            const existStaff = await models.STAFF.findOne({
                where: { NAME: data.name, EMAIL: data.email }
            })

            if (existStaff) {
                req.flash("error", `Nhân viên này đã được thêm rồi!`);
                res.redirect(req.get("Referrer") || "/"); // Sử dụng Referrer để quay lại trang trước
                return;
            }

            const newStaff = await models.STAFF.create({
                NAME: data.name,
                EMAIL: data.email,
                GENDER: data.gender,
                ADDRESS: data.address,
                PHONE: data.phone,
                ROLE: data.role,
                RATING: 0,
                ACCOUNT_ID: data.accountId,
                LOCATION_ID: data.locationId,
            });

            console.log('>>> New user: ', data);

            req.flash("success", `Thêm mới nhân viên thành công!`);

            res.redirect('/api/staff/findAll');
        } catch (error) {
            res.status(500).json({ error: 'Something went wrong' });
        }
    }

    //[GET] /api/staff/edit/:id
    async showEditForm(req, res, next) {
        try {
            const id = req.params.id;

            const staff = await models.STAFF.findOne({
                where: { STAFF_ID: id },
            })

            const location = await models.LOCATION.findAll();
            console.log('>>>> Location');

        

            res.render('staff/edit', {
                title: 'Chỉnh sửa nhân viên',
                staff: staff.dataValues,
                location: location,
            });
        } catch (error) {
            res.status(404).json({ message: "Không tìm thấy nhân viên!" });
        }
    }

    //[PUT] /api/staff/edit/:id
    async doEdit(req, res, next) {
        try {
            const staffEdited = req.body;
            console.log('>>>> staff edited: ', staffEdited);

            const [updatedRowsCount] = await models.STAFF.update({
                NAME: staffEdited.name,
                EMAIL: staffEdited.email,
                GENDER: staffEdited.gender,
                PHONE: staffEdited.phone,
                ADDRESS: staffEdited.address,
                ROLE: staffEdited.role,
                LOCATION_ID: staffEdited.locationId,
                ACCOUNT_ID: staffEdited.accountId,
            }, { where: { STAFF_ID: req.params.id } });

            if (updatedRowsCount > 0) {
                req.flash("success", `Chỉnh sửa nhân viên thành công!`);
            } else {
                req.flash("error", `Không tìm thấy nhân viên để chỉnh sửa!`);
            }

            res.redirect('/api/staff/findAll');
        } catch (error) {
            console.error(error);
            req.flash("error", `Có lỗi xảy ra!`);
            res.redirect(req.get("Referrer") || "/"); // Sử dụng Referrer để quay lại trang trước
        }
    }


    //[DELETE] /api/staff/delete/:id
    async doDelete(req, res, next) {
        try {
            await models.STAFF.destroy({
                where: { STAFF_ID: req.params.id }
            })

            req.flash('success', `Xóa nhân viên thành công!`);
            res.redirect('/api/staff/findAll');
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra!' });
        }
    }

    //[GET] /api/staff/detail/:id
    async showDetail(req, res, next) {
        try {
            const staff = await models.STAFF.findOne({
                where: { STAFF_ID: req.params.id },
            });
            console.log(staff);

            res.render('staff/detail', {
                staff: staff.dataValues,
            });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: "Không tìm thấy nhân viên!" });
        }
    }
}

module.exports = new StaffController;