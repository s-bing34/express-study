/*
 * 加载依赖库
 */
var express = require('express');
var ejs = require('ejs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// 中间件body-parser和multer用于处理和解析post请求的数据
var bodyParser = require('body-parser');
var multer = require('multer');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

// 创建项目实例
var app = express();

// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 定义模板引擎和模板文件位置,模板后缀名
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// 定义icon图标
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// 定义日志和输出级别
app.use(logger('dev'));

// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// 定义cookie解析器
app.use(cookieParser());
// 经过中间件处理后，可以通过req.session访问session object。比如如果你在session中保存了session.userId就可以根据userId查找用户的信息了。
app.use(session({
    store: new RedisStore({
	    'host': '192.168.2.181',
	    'port': '6379',
	    'ttl': 60 * 60 * 24 * 30,   //session的有效期为30天(秒)
    }),
    secret: 'test',
    resave:true,
    saveUninitialized:false
}));

app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('oh no')) // handle error
  }
  next() // otherwise continue
})

// 设置中间件用户信息
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    res.locals.message = '';
    if(err){
    	res.locals.message = err;
    }
    next();
});

// 加载路由控制
var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
// 匹配路径和路由
app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);


app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('oh no')) // handle error
  }
  next() // otherwise continue
})

// 404错误处理
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// 开发环境，500错误处理和错误堆栈跟踪
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// 生产环境，500错误处理
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


// 输出模型app
module.exports = app;
