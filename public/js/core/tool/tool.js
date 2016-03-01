/*	
 * @Author			舒兵 2015-02-13
 * @Update			2015-02-13
 * @Name			tool.js
 * @Description		常用工具
*/
define(function(require, exports, module){
	'use strict';
	//判断浏览器版本
	exports.browser = function(){
		var browser = {},
        	verson = navigator.userAgent.toLowerCase(),
        	s;
        if((s = verson.match(/msie ([\d.]+)/))){
        	browser.type = 'ie';
        	browser.verson = s[1];
        }else if((s = verson.match(/firefox\/([\d.]+)/))){
        	browser.type = 'firefox';
        	browser.verson = s[1];
        }else if((s = verson.match(/chrome\/([\d.]+)/))){
        	browser.type = 'chrome';
        	browser.verson = s[1];
        }else if((s = verson.match(/opera.([\d.]+)/))){
        	browser.type = 'opera';
        	browser.verson = s[1];
        }else if((s = verson.match(/version\/([\d.]+).*safari/))){
        	browser.type = 'safari';
        	browser.verson = s[1];
        }else if((s = verson.match(/version\/([\d.]+).*netscape/))){
        	browser.type = 'netscape';
        	browser.verson = s[1];
        }else{
        	browser.type = '未检测到浏览器版本信息';
        	browser.verson = null;
        }
    	return browser;
	}
	//开启遮罩层默认class为js-mask，
	exports.mask = {
		show : function(opt){
			var selfDefault = {
					id : null,
					class : null
				},
				$mask,
				$body = $('body'),
				maxheight = $body.outerHeight(true);
			$mask = $('<div class="js-mask"></div>');
			selfDefault = $.extend(true, selfDefault, opt);
			//如果已存在遮罩层，就直接返回
			if($('.js-mask')[0]){
				return;
			}
			$mask.height($body.height());
			if(selfDefault.class){
				$mask.addClass(selfDefault.class);
			}
			if(selfDefault.id){
				$mask.attr('id',selfDefault.id);
			}
			$mask.appendTo($body);	
		},
		hide : function(opt){
			var $mask;
			if(opt && opt.selector){
				$mask = $(opt.selector);
			}else{
				$mask = $('.js-mask');
			}
			//关闭遮罩层
			if($mask[0]){
				$mask.remove();
			}
		}
	}
	//加载load动画
	exports.loading = {
		show : function(opt){
			var selfDefault = {
					mask : false,
					class : 'js-loading',
				},
				$loading,
				$body = $('body');
			$loading = $('<div class="js-loading"></div>');
			selfDefault = $.extend(true, selfDefault, opt);
			//如果已存在遮罩层，就直接返回
			if($('.js-loading')[0]){
				return;
			}
			$loading.addClass(selfDefault.class);
			$loading.appendTo($body);
			if(selfDefault.mask && !$('.js-mask')[0]){
				exports.mask.show({
					class : 'js-mask-loading'
				});
			}
		},
		hide : function(){
			var $loading = $('.js-loading'),
				$loadingMask = $('.js-mask-loading');
			//关闭遮罩层
			if($loading[0]){
				$loading.remove();
			}
			if($loadingMask[0]){
				$loadingMask.remove();
			}
		}
	}
	//判断是否为空
	exports.isEmpty = function(str){
		str = $.trim(str);
		return !str;
	}
	//打印日志
	exports.logMsg = function(msg){
		if(console && console.log){
			console.log(msg);
		}
	}
	//判断是否为email
	exports.isEmail = function(str, separater){
		if(!str){
			return false;
		}
		str = $.trim(str);
		var res = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i,
			arr,
			arrcur;
		if(separater){
			arr = str.split(separater);
		}else{
			arr = [str];
		}
		for(var i=0;i<arr.length;i++){
			arrcur = $.trim(arr[i]);
			if(!res.test(arrcur)){
				return false;
			}
		}
		return true;
	}
	//判断是否为手机号码 ，可以是香港号码8529/8526/8525开头，必须是十一位
	exports.isMobile = function(str, separater){
		if(!str){
			return false;
		}
		str = $.trim(str);
		var res = /^(\+|00)?((86)?(1[34578])[0-9]{9}|852[965][0-9]{7})$/i,
			arr,
			arrcur;
		if(separater){
			arr = str.split(separater);
		}else{
			arr = [str];
		}
		for(var i=0;i<arr.length;i++){
			arrcur = $.trim(arr[i]);
			if(arrcur.length !== 11){ 
				return false;
			}
			if(!res.test(arrcur)){
				return false;
			}
		}
		return true;
	}
	//判断是否为座机，必须大于七位数字
	exports.isPhone = function(str, separater){
		if(!str){
			return false;
		}
		str = $.trim(str);
		var res = /^((0[0-9]{2,3}\-)?[2-9][0-9]{6,7}|((00852|\+852)\-)?([2-3][0-9]{7}))+(\-[0-9]{1,4})?$/i,
			arr,
			arrcur;
		if(separater){
			arr = str.split(separater);
		}else{
			arr = [str];
		}
		for(var i=0;i<arr.length;i++){
			arrcur = $.trim(arr[i]);
			if(arrcur.length < 7){
				return false;
			}
			if(!res.test(arrcur)){
				return false;
			}
		}
		return true;
	}
	//判断是否为网址
	exports.isUrl = function(str){
		if(!str){
			return false;
		}
		str = $.trim(str);
		var res = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
			arr,
			arrcur;
		if(separater){
			arr = str.split(separater);
		}else{
			arr = [str];
		}
		for(var i=0;i<arr.length;i++){
			arrcur = $.trim(arr[i]);
			if(arrcur.length < 7){
				return false;
			}
			if(!res.test(arrcur)){
				return false;
			}
		}
		return true;
	}
	//统计长度
	exports.len = function(str, separater){
		return str.replace( /[^\x00-\xff]/g , "aa" ).length;
	}
	//替换全部匹配
	exports.replaceAll = function(str,s1,s2){
		return str.replace(new RegExp(s1,"gm"),s2);
	}
	//日期格式化
	exports.format = function(_date,fmt){
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
			console.log(new RegExp('(' + k + ')'));
			if (new RegExp('(' + k + ')').test(fmt)){
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
		/*
		 * Format(new Date(),"yyyy-MM-dd hh:mm:ss.S")
		 * 2015-03-27 16:19:36.423
		 */
	}
	//转义
	exports.escapeHtml=function(str){
		if(typeof(str)!="string"){
			return str;
		}
		if (exports.isEmpty(str)){
			return "";
		}
		str = replaceAll(str, "&", "&amp;");
		str = replaceAll(str, "\"", "&quot;");
		str = replaceAll(str, " ", "&nbsp;");
		str = replaceAll(str, "<", "&lt;");
		str = replaceAll(str, ">", "&gt;");
		str = replaceAll(str, "\'", "&#039;");
		str = replaceAll(str, "\r\n", "<br/>");
		str = replaceAll(str, "\n","<br/>");
		str = replaceAll(str,  "\r","<br/>");
		return str;
	};
	//反转义
	exports.unescapeHtml=function(str){
		if(typeof(str)!="string"){
			return str;
		}
		if (exports.isEmpty(str)){
			return "";
		}
		str = replaceAll(str, "&quot;", "\"");
		str = replaceAll(str, "&nbsp;", " ");
		str = replaceAll(str, "&lt;", "<");
		str = replaceAll(str, "&gt;", ">");
		str = replaceAll(str, "&#039;", "\'");
		str = replaceAll(str, "<br>", "\n");
		str = replaceAll(str, "<br\/>", "\n");
		str = replaceAll(str, "&#61;", "=");
		str = replaceAll(str, "&amp;", "&");
		return str;
	};
	//cookie
	exports.cookie = {
		set : function(name, value, days){
			var _date = new Date();
			_date.setDate(_date.getDate()+days);
			document.cookie = name + '=' + escape(value)+((days==null) ? '' : ';expires='+_date.toGMTString());
		},
		get : function(name){
			if(document.cookie.length>0){
				var a = document.cookie.indexOf(name + '='),
					b;
			  	if (a!=-1){
			    	a = a + name.length + 1;
			   		b = document.cookie.indexOf(';',a);
			   	 	if (b==-1){
			   	 		b = document.cookie.length;
			   	 	} 
			   	 	return unescape(document.cookie.substring(a,b))
			    }
			}
			return null;
		},
		remove : function(name){
			this.set(name,null)
		}
	}
})