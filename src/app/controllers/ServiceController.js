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
            const { name, description, price } = req.body;
            const imageFile = req.file;

            // Đọc file và chuyển thành base64
            const imageBase64 = fs.readFileSync(imageFile.path, { encoding: 'base64' });

            // Tạo mới dịch vụ và lưu image dưới dạng base64
            const newService = await models.SERVICE.create({
                NAME: name,
                DESCRIPTION: description,
                PRICE: price,
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

    }

    //[PUT] /api/services/edit/:id
    async doEdit(req, res, next) {

    }

    //[DELETE] /api/services/delete/:id
    async doDelete(req, res, next) {

    }

    //[GET] /api/services/detail/:id
    async showDetail(req, res, next) {

    }
}

module.exports = new ServiceController();