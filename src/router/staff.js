const staffController = require('../app/controllers/StaffController');
const validate = require('../validations/staff');
const express = require('express');
const router = express.Router();
const authorize = require('../client/authorize-middleware');
const accountMiddleware = require('../client/account-middleware');

router.get('/findAll', authorize(['Admin']), staffController.showAllStaff);
router.get('/create', authorize(['Admin']), staffController.showCreateForm);
router.post('/create', authorize(['Admin']), validate.staffValidation, staffController.doCreate);
router.get('/edit/:id', authorize(['Admin', 'Staff']), accountMiddleware.checkEditPermission, staffController.showEditForm);
router.put('/edit/:id', authorize(['Admin', 'Staff']), accountMiddleware.checkEditPermission, validate.staffValidation, staffController.doEdit);
router.delete('/delete/:id', authorize(['Admin']), staffController.doDelete);
router.get('/detail/:id', authorize(['Admin', 'Staff']), accountMiddleware.checkEditPermission, staffController.showDetail);

module.exports = router;