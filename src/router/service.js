const express = require('express');
const router = express.Router();
const serviceController = require('../app/controllers/ServiceController');
const multer = require('multer');

// Cấu hình multer
const upload = multer({ dest: 'uploads/' });

router.get('/findAll', serviceController.showAll);
router.get('/create', serviceController.showCreateForm);

// Cấu hình router để sử dụng middleware upload file trước khi controller xử lý
router.post('/create', upload.single('image'), serviceController.doCreate);

router.get('/edit/:id', serviceController.showEditForm);
router.put('/edit/:id', upload.single('image'), serviceController.doEdit);

router.delete('/edit/:id', serviceController.doDelete);
router.get('/detail/:id', serviceController.showDetail);

module.exports = router;