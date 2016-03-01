/*	
 * @Author			舒兵 2015-02-13
 * @Update			2015-02-13
 * @Name			validate.js
 * @Description		表单验证
*/
define(function(require, exports, module){
	'use strict';	
	var tool = require('tool'),
		selfDefault = {
			trim : true,					//是否去掉两边的空格
			validOnChange : false, 			//是否值改变时候立即验证
			allowEmpty:true,				//允许空值
			async:true,						//true异步,false同步
			errorClass : null,				//失败添加class
			successClass : null,			//成功添加class
			msg : null,						//显示错误信息
			msgId : null,					//显示错误信息的id
			successFunction : null,			//验证成功执行
			errorFunction : null,			//验证失败执行
			min : null,						//最小长度
			max : null,						//最大长度
			separator : null,				//分隔符
			format : null,					//是否为时间类型
			negative : null					//允许为负数
		},
		selfOptions,
		ramcode = 0,
		rules = {},		//所有验证规则
		validAll = {};	//所有已经绑定的验证元素与其options集合
	
	//验证单个规则
	exports.vaildRule = function(value, obj, options, type){
		var rule;
		if(type){
			rule = rules[type];
			//没有该规则
			if(!rule)
			{
				tool.logMsg("没有定义该规则!");
				return true;
			}
		}
		var r;
		if(type){
			options.type = type;
		}
		//根据长度传参
		if(rule.length==3){
			r = rule(value,obj,options);
		}else{
			r = rule(value,options);
		}
		//验证失败
		if(!r){
			if(options.errorClass && obj){
				obj.addClass(options.errorClass);
			}
			if(options.errorClass && options.msgId){
				var $msgObj = $(options.msgId);
				$msgObj.addClass(options.errorClass).html(options.msg);
			}
			if(options.errorFunction){
				var f = function(){
					options.errorFunction(obj,options);
				};
				if(options.async){
					setTimeout(f,1);
				}else{
					f();
				};
			}
			return false;
		}
		return true;
	};
	
	//验证单个元素的值
	exports.vaildVal = function(value,obj,options){
		if(!options.type)
		{
			tool.logMsg("请选择验证规则类型!");
		}else{
			var types = options.type;
			//单个验证规则
			if(typeof(options.type)=="string"){
				types = [options.type];
			}
			//防止重复验证相同规则
			var _v={};
			for(var j=0;j<types.length;j++){
				if(!_v[types[j]])
				{
					//对单个元素的值进行规则一一校验
					if(!exports.vaildRule(value,obj,options,types[j])){
						return false;
					}
					_v[types[j]]=1;
				}
			}
		}//if end
		return true;
	}
	
	//验证单个元素
	exports.vaildSingle = function(obj){
		var vid = obj.attr("validator");
		if(!vid){
			return true;
		}
		//调用当前元素的options
		var curOptions = validAll[vid],
			curVal;
		/*
		 *IE下,换行是\r\n,当jquery的val()方法会将\r删除
		 *当使用表单提交(非AJAX)提交时,可能造成提交的长度与验证的长度不一致,引起数据库长度溢出
		 *因此,除select外,使用原生的value方法
		*/
		switch(obj[0].tagName){
			case "SELECT":
				curVal = obj.val();
				break;
			default:
				curVal = obj[0].value;
		}
		var outOptions = [];
		for(var i=0;i<curOptions.length;i++){
			//需要返回的参数
			var outOption = {};
			if(curOptions[i].trim){
				//过滤两边空格
				curVal = $.trim(curVal);
			}
			//验证单个元素的值
			if(!exports.vaildVal(curVal,obj,curOptions[i])){
				return false;
			}
			outOptions.push(outOption);
		}//for end

		//全部验证通过,执行successFunction
		for(var i=0;i<curOptions.length;i++)
		{
			var options=curOptions[i];
			if(options.errorClass && obj){
				obj.removeClass(options.errorClass);
			}
			if(options.errorClass && options.msgId){
				var $msgObj = $(options.msgId);
				$msgObj.removeClass(options.errorClass).html('');
			}
			if(options.successFunction)
			{
				var opt = outOptions[i];
				var f=function(){
					options.successFunction(obj,opt);
				};
				if(options.async)//异步
				{
					setTimeout(f,1);
				}else f();
			}
		}
		return true;
	};
	
	//开启验证
	exports.validate = function(obj, parame){
		//判断参数类型
		if(typeof(parame)=="object")
		{
			//即时验证
			var outOption = {};
			if(_validOneTarget(obj,null,parame,outOption) && parame.successFunction)
			{
				if(parame.async)//异步
				{
					setTimeout(function(){
						parame.successFunction(obj,outOption);
					},1);
				}else{
					parame.successFunction(obj,outOption);
				}
			}
			return;
		}
		if(typeof(parame)!=="boolean"){
			parame = true;
		}
		var selector = $(obj),
			tag = selector[0].tagName.toUpperCase();
		//判断是否为单个元素验证
		switch(tag){
			case "SELECT":
			case "INPUT":
			case "TEXTAREA":
				return exports.vaildSingle(selector);
		}
		//查找子类所有可验证元素
		var selectorAll = selector.find("select[validator],input[validator],textarea[validator]"),
			result = true;
		for(var i=0; i<selectorAll.length; i++){
			if(!exports.vaildSingle($(selectorAll[i]))){
				//是否出错就立即停止校验，否则验证完所有
				if(parame){
					return false;
				}else{
					result=false;
				}
			}
		}
		return result;
	};
	
	//绑定验证规则
	exports.bind = function(objs, options){
		var vids = [],
			$objs = $(objs);
			
		options = $.extend({}, selfDefault, options);
		
		//是否值改变时候立即验证
		if(options.validOnChange){
			$objs.change(function(){
				exports.validate(this,true);
			});
		}
		
		//为每一个元素绑定规则
		for(var i=0; i<$objs.length; i++ ){
			var $obj = $($objs[i]),
				vid = $obj.attr("validator");
			//为每一个元素创建一个规则ID
			if(!vid){
				vid = "validator"+(++ramcode)+(new Date()).getTime();
				$obj.attr("validator", vid);
			}
			if(!validAll[vid]){
				validAll[vid] = [];
			}

			//放入数组
			validAll[vid].push(options);

			//放入返回的数组
			vids.push(vid);
		}
		return vids;
	};
	
	//注册验证规则
	exports.register = function(type,fun){
		rules[type] = fun;
	};
	
	//获取规则
	exports.get = function(type){
		return rules[type];
	};
	
	//正则匹配类型
	exports.register("regex", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		if(!options.regex)
		{
			tool.logMsg("正则匹配不存在!");
			return false;
		}
		return options.regex.test(str);
	});
	
	//空值验证
	exports.register("require", function(str, options){
		options.allowEmpty = false;
		return !tool.isEmpty(str);
	});
	
	//邮件验证
	exports.register("email", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		return tool.isEmail(str, options.separater);
	});
	
	//手机验证
	exports.register("mobile", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		return tool.isMobile(str, options.separater);
	});
	
	//座机验证
	exports.register("phone", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		return tool.isPhone(str, options.separater);
	});
	
	//验证是否日期时间
	exports.register("date", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		return (new Date(str).getDate()== str.substring(str.length-2));
	});
	
	//验证是否中文
	exports.register("chinese", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		options.regex = /^[\u4E00-\u9FA5]+$/;
		return exports.get("regex")(str, options);
	});
	
	//验证是否数字
	exports.register("int", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		if(options.negative)//允许负数
		{
			options.regex=/^[-]?\d+$/;
		}else{
			options.regex=/^\d+$/;
		}
		return exports.get("regex")(str, options);
	});
	
	//验证是否浮点数
	exports.register("float", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		if(options.negative)//允许负数
		{
			options.regex=/^[-]?\d+(\.\d+)?$/;
		}else{
			options.regex=/^\d+(\.\d+)?$/;
		}
		return exports.get("regex")(str, options);
	});
	
	//值等于
	exports.register("eq", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		//判断比较对象
		if(!options.compareTo){
			tool.logMsg("请指定要比较的对象！");
			return false;
		}
		var str2 = $(options.compareTo).val(),
			_date;
			
		//非日期类型比较
		if(!options.format){
			return str==str2;
		}
		
		//日期类型比较
		_date = exports.get("date");
		if(!(_date(str, options) && _date(str2, options))){
			return false;
		}
		return (new Date(str).getTime()) == (new Date(str2).getTime());
	});
	
	//值小于
	exports.register("lt", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		//判断比较对象
		if(!options.compareTo){
			tool.logMsg("请指定要比较的对象！");
			return false;
		}
		var str2 = $(options.compareTo).val(),
			_float,
			_date;
		
		//比较类型,数字
		if(!options.format){
			//验证是否为浮点数
			options.negative = true;
			_float = exports.get("float");
			if(!_float(str, options)){
				return false;
			}
			if(!_float(str2, options)){
				return false;
			}
			str = parseFloat(str);
			str2 = parseFloat(str2);
			return str<str2;
		}
		//比较类型为日期
		_date = exports.get("date");
		if(!(_date(str, options) && _date(str2, options))){
			return false;
		}
		return (new Date(str).getTime()) < (new Date(str2).getTime());
	});
	
	//值小于等于
	exports.register("le", function(str, options){
			var _eq = exports.get("eq"),
				_lt = exports.get("lt");
			return _eq(str, options) || _lt(str, options);
	});
	
	//值大于
	exports.register("gt", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		//判断比较对象
		if(!options.compareTo){
			tool.logMsg("请指定要比较的对象！");
			return false;
		}
		var str2 = $(options.compareTo).val(),
			_float,
			_date;
		
		//比较类型,数字
		if(!options.format){
			//验证是否为浮点数
			options.negative = true;
			_float = exports.get("float");
			if(!_float(str, options)){
				return false;
			}
			if(!_float(str2, options)){
				return false;
			}
			str = parseFloat(str);
			str2 = parseFloat(str2);
			return str>str2;
		}
		//比较类型为日期
		_date = exports.get("date");
		if(!(_date(str, options) && _date(str2, options))){
			return false;
		}
		return (new Date(str).getTime()) > (new Date(str2).getTime());
	});
	
	//值大于等于
	exports.register("ge", function(str, options){
			var _eq = exports.get("eq");
			var _gt = exports.get("gt");
			return _eq(str, options) || _gt(str, options);
	});
	
	//长度检查(一个中文两个字节)
	exports.register("length", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		if(!(options.min || options.max)){
			tool.logMsg("请指定长度范围！");
			return false;
		}
		var len = tool.len(str);
		if(options.min && len<options.min){
			return false;
		}
		if(options.max && len>options.max){
			return false;
		}
		return true;
	});
	
	//数字范围检查
	exports.register("range", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		if(!(options.min || options.max)){
			tool.logMsg("请指定数字范围！");
			return false;
		}
		//验证是否为浮点数
		options.negative = true;
		var _float = exports.get("float");
		if(!_float(str, options)){
			return false;
		}
		str = parseFloat(str);
		if(options.min && str<options.min){
			return false;
		}
		if(options.max && str>options.max){
			return false;
		}
		return true;
	});
	
	//验证网址
	exports.register("url", function(str, options){
		if( options.allowEmpty && tool.isEmpty(str) ){
			return true;
		}
		return tool.isUrl(str, options.separater);
	});
})
