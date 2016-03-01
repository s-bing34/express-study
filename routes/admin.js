/*
 * admin管理后台路由设置
 */
var express = require('express'),
	router = express.Router(),
	adminFun = require('../server/admin');

// 登录页
router.get('/login', function(req, res, next){
	res.render('admin/login', {layout: 'layout/layout_admin', title: '登录 - 后台管理系统'});
})

// 登录接口
router.post('/login/account', function(req, res, next){
	adminFun.getUser(req, res, next);
})

// 退出接口
router.get('/logout', function(req, res){
	req.session.destroy();
    res.redirect('login');
});

// 管理后台首页
router.get('/', function(req, res, next){
	console.log(req.session.user, 'index');
	if(!req.session.user){
		res.redirect('admin/login');
		req.session.error = "请先登录";
		return;
	}
	res.render('admin', {layout: 'layout/layout_admin', title: '后台管理系统', curPage: 'index'});
})

// 管理后台首页
router.get('/index', function(req, res, next){
	console.log(req.session.user, 'index');
	if(!req.session.user){
		res.redirect('login');
		req.session.error = "请先登录";
		return;
	}
	res.render('admin', {layout: 'layout/layout_admin', title: '后台管理系统', curPage: 'index'});
})

// 管理员列表
router.get('/userList', function(req, res, next){
	console.log(req.session.user, 'userlist');
	if(!req.session.user){
		res.redirect('login');
		req.session.error = "请先登录";
		return;
	}
	adminFun.getUserList(req, res, next, function(ret){
		res.render('admin/userList', {layout: 'layout/layout_admin', title: '管理员列表 - 后台管理系统', curPage: 'userList', userList: ret});
	});
})

// 修改管理员密码
router.post('/userList/changePassword', function(req, res, next){
	console.log(req.session.user, 'changePassword');
	if(!req.session.user){
		res.redirect('login');
		req.session.error = "请先登录";
		return;
	}
	adminFun.changePassword(req, res, next);
})
module.exports = router;