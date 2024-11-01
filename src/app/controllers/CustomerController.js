const { getAllCustomers } = require('../services/customerService')
const initialModelSqlServer = require('../models/initial-models');
const db = require('../models/index');
const models = initialModelSqlServer(db);

class CustomerController {

    //[GET] /api/customers/findAll
    async showAllCustomer(req, res, next) {
        const result = await getAllCustomers();
        res.json(result);
    }

    //[GET] /api/customers/create
    async showCreateForm(req, res, next) {
        res.render('customer/create');
    }

    //[POST] /api/customers/create
    async doCreate(req, res, next) {
        try {
            const data = req.body;

            console.log(data);

            const customer = await models.CUSTOMER.create({
                NAME: data.name,
                EMAIL: data.email,
                PHONE: data.phone,
                ADDRESS: data.address,
                DATE_OF_BIRTH: data.dateOfBirth,
                GENDER: data.gender,
                POINTS: 0,
                ACCOUNT_ID: 1,
            })

            req.flash("success", 'Thêm khách hàng thành công!');
            res.status(200).json({ message: "Thêm khách hàng thành công" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[GET] /api/customers/edit/:id
    async showEditForm(req, res, next) {
        try {
            const id = req.params.id;

            const customer = await models.CUSTOMER.findOne({
                where: { CUSTOMER_ID: id },
            })

            res.render('customer/edit', {
                title: 'Chỉnh sửa khách hàng',
                customer: customer.dataValues,
            });
        } catch (error) {
            res.status(404).json({ message: "Không tìm thấy khách hàng này!" })
        }
    }

    //[PUT] /api/customers/edit/:id
    async doEdit(req, res, next) {
        try {
            const customer = req.body;

            const [updatedRowsCount] = await models.CUSTOMER.update({
                NAME: customer.name,
                EMAIL: customer.email,
                PHONE: customer.phone,
                ADDRESS: customer.address,
                DATE_OF_BIRTH: customer.dateOfBirth,
                GENDER: customer.gender,
                POINTS: customer.points,
                ACCOUNT_ID: customer.accountId,
            }, { where: { CUSTOMER_ID: req.params.id } });

            if (updatedRowsCount > 0) {
                req.flash("success", `Chỉnh sửa khách hàng thành công!`);
            } else {
                req.flash("error", `Không tìm thấy khách hàng để chỉnh sửa!`);
            }

            res.redirect('/api/customers/findAll');
        } catch (error) {
            console.error(error);
            req.flash("error", `Có lỗi xảy ra!`);
            res.redirect(req.get("Referrer") || "/"); // Sử dụng Referrer để quay lại trang trước
        }
    }

    //[DELETE] /api/customers/delete/:id
    async doDelete(req, res, next) {
        try {
            await models.CUSTOMER.destroy({
                where: { CUSTOMER_ID: req.params.id }
            })

            req.flash('success', `Xóa khách hàng thành công!`);
            res.redirect('/api/customers/findAll');
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra!' });
        }
    }

    //[GET] /api/customers/detail/:id
    async showDetail(req, res, next) {
        try {
            const customer = await models.CUSTOMER.findOne({
                where: { CUSTOMER_ID: req.params.id },
            });

            res.render('customer/detail', {
                customer: customer.dataValues,
            });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: "Không tìm thấy khách hàng!" });
        }
    }
}

module.exports = new CustomerController;