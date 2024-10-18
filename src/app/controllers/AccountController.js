
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../models/index');
const initialModelSqlServer = require('../models/initial-models');
const { where } = require('sequelize');
const models = initialModelSqlServer(db);

const { getAllAccounts } = require('../services/accountService');

async function hashPasswordBcrypt(password) {
    const saltRounds = 5; // Độ mạnh của salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

class AccountController {
    //[GET] /api/accounts/findAll
    async showAllAccount(req, res, next) {
        const accounts = await getAllAccounts();
        res.json(accounts);
    }

    //[GET] /api/account/register
    showRegisterForm(req, res, next) {
        res.render('account/register');
    }

    //[POST] /api/accounts/register
    async doRegister(req, res, next) {
        const data = req.body;
        const hashedPassword = await hashPasswordBcrypt(data.password);
        data.password = hashedPassword;

        const existUsername = await models.ACCOUNT.findOne({
            where: { username: data.username }
        })
        if (existUsername) {
            req.flash("error", `Username đã tồn tại!`);
            res.redirect("back");
            return;
        }

        const newAccount = await models.ACCOUNT.create({
            USERNAME: data.username,
            PASSWORD: data.password,
            ROLE_ID: 3,
        });

        console.log('>>> New account: ', newAccount);

        req.flash("success", `Đăng ký tài khoản thành công!`);

        // set token user cho tài khoản vừa dky để ko cần đăng nhập lại
        // res.cookie('tokenUser', newAccount.TOKEN_USER);

        res.redirect('/accounts/findAll');
    }

    //[GET] /api/accounts/login
    showLoginForm(req, res, next) {
        res.render('account/login');
    }

    //[POST] /api/accounts/register
    async doLogin(req, res, next) {
        const data = req.body;

        const account = await models.ACCOUNT.findOne({
            where: { USERNAME: data.username }
        });

        if (account) {
            const comparePassword = await bcrypt.compare(data.password, account.PASSWORD);

            if (!comparePassword) {
                req.flash("error", `Mật khẩu không đúng!`);
                res.redirect("back");
                return;
            }

            const role = await models.ROLE.findOne({
                where: { ROLE_ID: account.ROLE_ID }
            });

            const staff = await models.STAFF.findOne({
                where: { ACCOUNT_ID: account.ACCOUNT_ID },
            })

            const customer = await models.CUSTOMER.findOne({
                where: { ACCOUNT_ID: account.ACCOUNT_ID },
            })

            const createToken = () => {
                if (account.username == "admin") {
                    const token = jwt.sign({ accountId: account.ACCOUNT_ID, role: role.NAME }, 'secret_key', { expiresIn: '1h' });
                    return token;
                } else {
                    if (staff) {
                        const token = jwt.sign({ accountId: account.ACCOUNT_ID, role: role.NAME, idPerson: staff.STAFF_ID }, 'secret_key', { expiresIn: '1h' });
                        return token;
                    } else {
                        const token = jwt.sign({ accountId: account.ACCOUNT_ID, role: role.NAME, idPerson: customer.CUSTOMER_ID }, 'secret_key', { expiresIn: '1h' });
                        return token;
                    }
                }
            }

            const token = createToken();

            res.cookie('tokenUser', token);
            console.log('>>> Token: ', token);

            // Trả về phản hồi
            res.json({ message: 'Login successful', token });
            return;
        }

        req.flash("error", `Không có username này!`);
        res.redirect("back");
    }

    //[GET] /api/accounts/logout
    async doLogout(req, res, next) {
        // Xóa token trong cookie
        res.clearCookie('tokenUser');

        req.flash("success", `Đăng xuất thành công!`);
        // Chuyển hướng người dùng về trang đăng nhập
        res.redirect('/api/site/home');
    }
}

module.exports = new AccountController();