/*
 * 实现与MySQL交互
 */
var mysql = require('mysql'),
	$conf = require('../config/db'),
	//方法
	adminFun = {},
	//连接池
	pool = mysql.createPool($conf.mysql);

// 验证用户名密码
adminFun.getUser = function(req, res, next){
	var userSql = 'select * from user where name=? && password=?',
		params = req.body;
	pool.getConnection(function(err, connection){
		connection.query(userSql, [params.name, params.password], function(err, result){
			if(result && result.length>0){
				var user = result[0];
		            req.session.user = user;
		            req.session.userId = user.id;
				res.json({
					success: true,
					msg: '登录成功'
				});
			}else{
				res.json({
					success: false,
					msg: '用户名或密码不正确'
				});
			}
			// 释放连接
			connection.release();
		})
	})
}

// 获取用户列表
adminFun.getUserList = function(req, res, next, callback){
	var userSql = 'select * from user';
	pool.getConnection(function(err, connection){
		connection.query(userSql, [], function(err, result){
			if(result && result.length>0){
				callback(result);
				res.locals.userList = result;
			}else{
				callback(null);
				res.locals.userList = null;
			}
			// 释放连接
			connection.release();
		})
	})
}

// 修改用户密码
adminFun.changePassword = function(req, res, next){
	var userSql = 'select * from user where id=? && password=?',
		setPasswordSql = 'update user set password=?  where id=?',
		params = req.body;
	pool.getConnection(function(err, connection){
		connection.query(userSql, [params.id, params.oldPassword], function(err, result){
			if(result && result.length>0){
				connection.query(setPasswordSql, [params.newPassword, params.id], function(err, result){
					if(result && result.changedRows>0){
						res.json({
							success: true
						});
					}else{
						res.json({
							success: false,
							msg: '密码修改失败'
						});
					}
				})
			}else{
				res.json({
					success: false,
					msg: '旧密码不正确'
				});
			}
			// 释放连接
			connection.release();
		})
	})
}

module.exports = adminFun;