// 
//  main.js
//  <微信报表>
//  
//  Created by 舒兵 on 2016-01-18.
//  Copyright 2016 舒兵. All rights reserved.
// 


var gz = angular.module('gz', ['ngMessages', 'ngRoute', 'ngSanitize', 'ngAnimate']);
var timeoutFun;
//  ========== 
//  = 全局设置 = 
//  ========== 

gz.run(function($rootScope, $window, $http, $interval, $timeout, $location, $routeParams){
	//改变hash时检测用户信息 
    $rootScope.$on('$locationChangeSuccess', function (event, next, current) {
    	document.body.scrollTop = 0;
    });
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
    	_loading.show();
    	if(timeoutFun){
	    	$timeout.cancel(timeoutFun);
    	}
    });
    $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
		timeoutFun = $timeout(function(){
    		_loading.hide();
		},1000)
    });
    $rootScope.submit = function(form){
    	$http.post('/users/addUser', {
    		name: form.name,
    		age: form.age,
    		time: new Date().getTime()
    	}).success(function(res){
    		console.log(res);
    	})
    }
});

//  ========== 
//  = 路由设置 = 
//  ========== 

gz.config(['$routeProvider', function($routeProvider) {
	//默认
	$routeProvider.when('/', { 
		templateUrl : '/wx/templates/ucenter.html?ver=' + ver,
		controller  : 'ucenterCtrl',
        resolve: {
            data: ['$q', function($q){
                var defer = $q.defer();
                setTimeout(function(){
                    defer.resolve('test1');
                }, 1000);
                return defer.promise;
            }]
        }
	});
	//404
	$routeProvider.otherwise({
		redirectTo: '/'
	});
}]);

//  ========== 
//  = 控制器 = 
//  ========== 

//全局提示
gz.controller('tipsCtrl', ['$rootScope', '$scope', '$http', '$timeout', '$routeParams', '$location', function($rootScope, $scope, $http, $timeout, $routeParams, $location){
	$rootScope.showTips = function(word, speed, callback){
		$timeout.cancel(timeoutFun);
		speed = speed || 1000;
		if(typeof word != 'string'){
			return;
		}
		$rootScope.tipsShow = true;
		$rootScope.tipsMsg = word;
		timeoutFun = $timeout(function(){
			$rootScope.tipsShow = false;
			$rootScope.tipsMsg = null;
			if(callback && typeof callback == 'function'){
				callback();
			}
		},speed);
	};
}]);

//登录
gz.controller('loginCtrl', ['$rootScope', '$scope', '$http', '$timeout', '$interval', '$routeParams', '$location', function($rootScope, $scope, $http, $timeout, $interval, $routeParams, $location){
	
}]);

//  ========== 
//  = 过滤器 = 
//  ========== 

gz.filter('tohtml', ['$sce', function ($sce) {
	return function (text) {
		return $sce.trustAsHtml(text);
	};
}]);

//设置截取字符串
gz.filter('substr', ['$sce', function ($sce) {
	return function (val, start, end) {
		if(!val){
			return;
		}
		return val.substr(start,end);
	};
}]);

//设置周
gz.filter('setToWeek', ['$sce', function ($sce) {
	return function (val) {
		if(!val){
			return;
		}
		var _day = new Date(val.substr(0,4), parseInt(val.substr(4,2))-1, val.substr(6,2)).getDay(),
			week = ['日','一','二','三','四','五','六'];
		return week[_day];
	};
}]);

//返回绝对值
gz.filter('abs', ['$sce', function ($sce) {
	return function (val) {
		return Math.abs(val);
	};
}]);

//  ========== 
//  = 方法 = 
//  ========== 

//获取指定名称的cookie的值
function getCookie(objName){
    var arrStr = document.cookie.split("; ");
    for(var i = 0;i < arrStr.length;i ++){
        var temp = arrStr[i].split("=");
        if(temp[0] == objName)
            return unescape(temp[1]);
    }
}
function setCookie(name, value, days){
	var _date = new Date();
	_date.setDate(_date.getDate()+days);
	document.cookie = name + '=' + escape(value)+((days==null) ? '' : ';expires='+_date.toGMTString());
}

function format(_date,fmt){
	var o = {
		"M+": _date.getMonth() + 1, //月份   
		"d+": _date.getDate(), //日   
		"h+": _date.getHours(), //小时   
		"m+": _date.getMinutes(), //分   
		"s+": _date.getSeconds(), //秒   
		"S":  _date.getMilliseconds() //毫秒   
	};
	if (/(y+)/.test(fmt)){
		fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o){
		if (new RegExp('(' + k + ')').test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

