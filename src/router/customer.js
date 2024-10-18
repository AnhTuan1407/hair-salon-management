const customerController = require('../app/controllers/CustomerController');
const validate = require('../validations/customer');
const express = require('express');
const router = express.Router();
const authorize = require('../client/authorize-middleware');
const accountMiddleware = require('../client/account-middleware');

router.get('/findAll', authorize(['Admin']), customerController.showAllCustomer);
router.get('/create', customerController.showCreateForm);
router.post('/create', validate.customerValidation, customerController.doCreate);
router.get('/edit/:id', authorize(['Admin', 'Customer']), accountMiddleware.checkEditPermission, customerController.showEditForm);
router.put('/edit/:id', authorize(['Admin', 'Customer']), validate.customerValidation, accountMiddleware.checkEditPermission, customerController.doEdit);
router.delete('/delete/:id', authorize(['Admin']), customerController.doDelete);
router.get('/detail/:id', authorize(['Admin', 'Customer']), accountMiddleware.checkEditPermission, customerController.showDetail);

module.exports = router;