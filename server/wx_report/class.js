// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../../config/db');
var $sql = require('./sqlMap');

// 使用连接池，提升性能
var pool = mysql.createPool($conf.mysql);

// 向前台返回JSON方法的简单封装
var jsonWrite = function(res, ret) {
	if (typeof ret === 'undefined') {
		res.json({
			code: '1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};

module.exports = {
	//获取场馆列表
	getUser: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.body;
			// 建立连接，向表中插入值
			connection.query($sql.getUser, [param.name, param.password], function(err, result) {
				var respond;
				if (result && result.length>0) {
					respond = {
						code: 200,
						success: true,
						msg: '查询成功'
					};
				}else{
					respond = {
						code: -1001,
						success: false,
						msg: '用户名或密码不正确'
					};
				}
				// 以json形式，把操作结果返回给前台页面
				jsonWrite(res, respond);

				// 释放连接 
				connection.release();
			});
		});
	}
};
