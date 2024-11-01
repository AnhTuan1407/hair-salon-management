const express = require('express');
const router = express.Router();
const serviceController = require('../app/controllers/ServiceController');
const multer = require('multer');
const validation = require('../validations/service');
const fileUploadMiddleware = require('../client/file-upload-middleware');

// Cấu hình multer
const upload = multer({ dest: 'uploads/' });

router.get('/findAll', serviceController.showAll);
router.get('/create', serviceController.showCreateForm);

// Cấu hình router để sử dụng middleware upload file trước khi controller xử lý
router.post('/create', upload.single('image'), validation.createValidation, serviceController.doCreate);

router.get('/edit/:id', serviceController.showEditForm);
router.put('/edit/:id', fileUploadMiddleware, serviceController.doEdit);

router.delete('/delete/:id', serviceController.doDelete);
router.get('/detail/:id', serviceController.showDetail);

module.exports = router;