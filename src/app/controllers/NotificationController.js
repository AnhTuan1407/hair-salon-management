const db = require('../models/index');
const initialSQLServerModels = require('../models/initial-models');
const models = initialSQLServerModels(db);
const { sendEmailNotification } = require('../services/mailSenderService');

class NotificationController {

    //[GET] /api/notifications/showAllNotification
    async showAllNotification(req, res, next) {
        try {
            const data = await models.NOTIFICATION.findAll({});
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ message: "Không tìm thấy thông báo nào!" });
            }
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[GET] /api/notifications/showAllNotification
    async formCreateMail(req, res, next) {
        const customerEmail = await models.CUSTOMER.findAll({
            attributes: ['EMAIL'],
        })

        const staffEmail = await models.STAFF.findAll({
            attributes: ['EMAIL'],
        })

        let emailList = [];
        for (let item of customerEmail) {
            emailList.push(item.dataValues.EMAIL);
        }
        for (let item of staffEmail) {
            emailList.push(item.dataValues.EMAIL);
        }

        res.render('notification/formMail', {
            title: "Gửi mail thông báo",
            emailList: JSON.stringify(emailList),
        });
    }

    //[POST] /api/notifications/sendMail
    async sendMail(req, res, next) {
        const { subject, message, recipients } = req.body;
        const recipientList = recipients.split(',').map(email => email.trim());
        console.log('>>> List email nhận: ', recipientList);

        try {
            const accountIdList = [];

            for (let item of recipientList) {
                let accountId;
                if (item != "") {
                    let cus = await models.CUSTOMER.findOne({
                        where: { EMAIL: item },
                    })
                    let staff = await models.STAFF.findOne({
                        where: { EMAIL: item },
                    })

                    if (cus) {
                        accountId = cus.ACCOUNT_ID;
                    } else {
                        accountId = staff.ACCOUNT_ID;
                    }
                    accountIdList.push(accountId);
                }
            }

            console.log('>>> List accountId nhận: ', accountIdList);

            //Lưu dữ liệu vào database
            for (let item of accountIdList) {
                const notification = await models.NOTIFICATION.create({
                    TITLE: subject,
                    CONTENT: message,
                    ACCOUNT_ID: item,
                    ACCOUNT_SEND_NOTIFICATION: 1,
                    STATUS: 0,
                    NOTIFICATION_TYPE: "Gmail",
                });

                console.log(notification);
            }

            //Gửi mail
            sendEmailNotification(subject, message, recipientList);
            res.status(200).json({ message: 'Email đã được gửi thành công' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi gửi email' });
        }
    }
}

module.exports = new NotificationController();