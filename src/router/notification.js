const express = require('express');
const router = express.Router();
const notificationController = require('../app/controllers/NotificationController');
const authorize = require('../client/authorize-middleware');
const notificationValidate = require('../validations/notification');
router.get('/showAllNotification', authorize(['Admin']), notificationController.showAllNotification);
router.get('/sendMail', authorize(['Admin']), notificationController.formCreateMail);
router.post('/sendMail', authorize(['Admin']), notificationValidate.notificationForm, notificationController.sendMail);

module.exports = router;