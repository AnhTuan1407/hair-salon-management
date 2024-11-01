const db = require('../models/index');
const initialModelsSQLServer = require('../models/initial-models');
const models = initialModelsSQLServer(db);

const multer = require('multer');
const fs = require('fs');

// Khởi tạo multer để lưu file tạm thời
const upload = multer({ dest: 'uploads/' });

class ServiceController {

    //[GET] /api/services/findAll
    async showAll(req, res, next) {
        try {
            const data = await models.SERVICE.findAll();
            res.render('service/show', {
                title: "Danh sách dịch vụ",
                services: data,
            });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" })
        }
    }

    //[GET] /api/services/create
    async showCreateForm(req, res, next) {
        res.render('service/create');
    }

    //[POST] /api/services/create
    async doCreate(req, res, next) {
        try {
            const { name, description, price, estimateTime } = req.body;
            const imageFile = req.file;

            // Đọc file và chuyển thành base64
            const imageBase64 = fs.readFileSync(imageFile.path, { encoding: 'base64' });

            // Tạo mới dịch vụ và lưu image dưới dạng base64
            const newService = await models.SERVICE.create({
                NAME: name,
                DESCRIPTION: description,
                PRICE: price,
                ESTIMATE_TIME: estimateTime,
                IMAGE: imageBase64, // Lưu chuỗi base64 vào DB
            });

            // Xóa file tạm sau khi đã chuyển đổi
            fs.unlinkSync(imageFile.path);

            res.redirect('/api/services/findAll');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi xảy ra!" })
        }
    }


    //[GET] /api/services/edit/:id
    async showEditForm(req, res, next) {
        try {
            const id = req.params.id;
            const service = await models.SERVICE.findOne({
                where: { SERVICE_ID: id },
            })
            console.log(service);

            if (service) {
                res.render('service/edit', {
                    title: "Chỉnh sửa dịch vụ",
                    service: service.dataValues,
                })
            } else {
                res.status(404).json({ message: "Không tìm thấy dịch vụ" });
            }

        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[PUT] /api/services/edit/:id
    async doEdit(req, res, next) {
        try {
            const { name, description, price, estimateTime } = req.body;
            const id = req.params.id;

            const serviceFetch = await models.SERVICE.findOne({
                where: { SERVICE_ID: id },
            })

            let imageBase64;
            if (req.file) {
                const imageFile = req.file;
                imageBase64 = fs.readFileSync(imageFile.path, { encoding: 'base64' });
            } else {
                imageBase64 = serviceFetch.IMAGE;
            }

            const [updatedRowsCount] = await models.SERVICE.update({
                NAME: name,
                DESCRIPTION: description,
                PRICE: price,
                ESTIMATE_TIME: estimateTime,
                IMAGE: imageBase64,
            }, { where: { SERVICE_ID: id } });

            if (updatedRowsCount > 0) {
                req.flash("success", `Chỉnh sửa dịch vụ thành công!`);
                res.redirect('/api/services/findAll');
            } else {
                req.flash("error", `Không tìm thấy khách hàng để chỉnh sửa!`);
            }
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[DELETE] /api/services/delete/:id
    async doDelete(req, res, next) {

    }

    //[GET] /api/services/detail/:id
    async showDetail(req, res, next) {
        try {
            const id = req.params.id;
            const service = await models.SERVICE.findOne({
                where: { SERVICE_ID: id },
            })

            if (service) {
                res.render('service/detail', {
                    title: "Chi tiết dịch vụ",
                    service: service.dataValues,
                })
            } else {
                res.status(404).json({ message: "Không tìm thấy dịch vụ" });
            }

        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }
}

module.exports = new ServiceController();