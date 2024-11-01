const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const hostName = process.env.HOST_NAME;
const path = require('path');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const router = require('./router/index');
const Handlebars = require('handlebars');
const equalHelper = require('./helpers/equal');
const incrementHelper = require('./helpers/increment');
const formatPeriod = require('./helpers/formatPeriod');
const withinHour = require('./helpers/withinHour');
const calculateBox = require('./helpers/calculateBox');
const and = require('./helpers/and');
const convertToDate = require('./helpers/convertToDate');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');


// Sử dụng cookie-parser middleware
app.use(cookieParser());

// Override method
app.use(methodOverride('_method'));

// Đăng ký helper 'eq' với Handlebars
Handlebars.registerHelper('eq', equalHelper);
Handlebars.registerHelper('increment', incrementHelper);
Handlebars.registerHelper('formatPeriod', formatPeriod.formatPeriod);
Handlebars.registerHelper('withinHour', withinHour);
Handlebars.registerHelper('and', and);
Handlebars.registerHelper('calculateTop', calculateBox.top);
Handlebars.registerHelper('calculateHeight', calculateBox.height);
Handlebars.registerHelper('convertByDay', convertToDate.convertByDay);
Handlebars.registerHelper('convertDateToObj', convertToDate.convertDateToObj);
Handlebars.registerHelper('getDate', convertToDate.getDate);
Handlebars.registerHelper('formatDate', convertToDate.formatDate);

//Middle ware
// const userMiddleware = require('./client/user-middleware');

//express-flash để hiển thị thông báo
const session = require('express-session');
const flash = require('express-flash');

// Middleware để sử dụng session
app.use(session({
    secret: 'your secret', // Thay đổi thành bí mật của bạn
    resave: false,
    saveUninitialized: true
}));

// Middleware cho flash messages
app.use(flash());

//Middleware xử lý dữ liệu từ form data submit lên
app.use(
    express.urlencoded({
        extended: true,
    }),
);

//Middle ware lấy info user
// app.use(userMiddleware.infoUser);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Để thông báo flash có thể được truy cập trong các template
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.engine('.hbs', engine({
    extname: '.hbs',
}));

app.set('views', path.join(__dirname, 'resources', 'views'));
app.set('view engine', '.hbs');

app.use(morgan('combined'));

router(app);

app.listen(port, hostName, () => {
    console.log(`Listening port: ${port}, hostname: ${hostName}`);
})
