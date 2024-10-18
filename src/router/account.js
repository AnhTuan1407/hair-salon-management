const express = require('express');
const router = express.Router();
const accountController = require('../app/controllers/AccountController');
const validate = require('../validations/account');
const authorize = require('../client/authorize-middleware');
const accountMiddleware = require('../client/account-middleware');

router.get('/findAll', authorize(['Admin']), accountController.showAllAccount);
router.get('/register', accountController.showRegisterForm);
router.post('/register', validate.registerPost, accountController.doRegister);
router.get('/login', accountMiddleware.checkNotLoggedIn, accountController.showLoginForm);
router.post('/login', accountMiddleware.checkNotLoggedIn, validate.loginPost, accountController.doLogin);
router.get('/logout', accountController.doLogout);

module.exports = router;