var express = require('express');
var router = express.Router();
var userDao = require('../server/userDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log(234)
  res.render('users', { title: '测试中...', name: 'Su' });
});

router.post('/addUser', function(req, res, next) {
  	userDao.add(req, res, next);
});
module.exports = router;
