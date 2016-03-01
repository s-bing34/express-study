/*	
 * @Author			舒兵 2015-02-13
 * @Update			2015-02-13
 * @Name			page.js
 * @Description		分页
*/
define(function(require, exports, module){
	'use strict';
	var selfDefault = {
			current : 1,				//当前显示页
			total : 1,					//共计分页数
			size : 10,					//每页显示的数目
			count : 0,					//共计数目
			label : 4,					//前后各显示的标签数
			showfirst : true,			//是否显示"首页"
			showprev : true,			//是否显示"上一页"
			shownext : true,			//是否显示"下一页"
			showlast : true,			//是否显示"尾页"
			showjump : false,			//是否显示跳转
			showselect : false,			//是否显示下拉分页
			callback : null,			//点击后执行的回调函数
			word : {//显示文字
					first : '首页',
					prev : '上一页',
					next : '下一页',
					last : '尾页',
					jump : '跳转至'
				}
		};
	module.exports = function(selector,options){
		//初始化参数
		var $container = $(selector),
			$ul = $('<ul></ul>'),
			opt = $.extend({}, selfDefault, options),
			word = $.extend({}, selfDefault.word, options.word),
			page = {};
		page = {
			setPoint: function(){
				//起点和截点，分页显示的范围
				var _s = opt.current - opt.label,
					_e = opt.current + opt.label;
				if(_s<=1){
					//以起点为标准
					this.startPoint = 1 ;
					_e = _e - _s + 1;
					if(_e>opt.total){
						this.endPoint = opt.total;
					}else{
						this.endPoint = _e;
					}
				}else{
					if(_e<opt.total){
						this.endPoint = _e;
						this.startPoint = _s;
					}else{
						//以终点为标准往前推
						this.endPoint = opt.total;
						_s = opt.total - 2*opt.label;
						this.startPoint = (_s>0)?_s:1;
					}
				}
				//当当前页不在正确的分页范围内时，跳转到首页
				if(opt.current < 1 || opt.current > opt.total){
					this.init(1);
					return;
				}
			},
			init: function(){
				this.setPoint();
				this.initDom();
				this.bind();
			},
			initDom: function(){
				for(var i=this.startPoint;i<=this.endPoint;i++){
					if(i==opt.current){
						$ul.append('<li class="page current">' + i + '</li>');
					}else{
						$ul.append('<li class="page">' + i + '</li>');
					}
				}
				//上一页
				if(opt.showprev){
					$ul.prepend('<li class="prev k">' + word.prev + '</li>');
					if(opt.current <= 1){
						$('.prev',$ul).addClass('unclick');
					}
				}
				//首页
				if(opt.showfirst){
					$ul.prepend('<li class="first k">' + word.first + '</li>');
					if(opt.current <= 1){
						$('.first',$ul).addClass('unclick');
					}
				}
				//下一页
				if(opt.showprev){
					$ul.append('<li class="next k">' + word.next + '</li>');
					if(opt.current >= opt.total){
						$('.next',$ul).addClass('unclick');
					}
				}
				//尾页
				if(opt.showfirst){
					$ul.append('<li class="last k">' + word.last + '</li>');
					if(opt.current >= opt.total){
						$('.last',$ul).addClass('unclick');
					}
				}
				//跳转
				if(opt.showjump){
					$ul.append('<li class="jump"><label><span>' +
								word.jump +
								'</span><input type="text" class="pagenum" /></label></li>');
				}
				//下拉
				if(opt.showselect){
					var _selelct = [];
					for(i=1;i<=opt.total;i++){
						if(i==opt.current){
							_selelct.push('<option value="' + i + '" selected>'+i+'</option>');
						}else{
							_selelct.push('<option value="' + i + '">'+i+'</option>');
						}
					}
					$ul.append('<li class="select"><select>' + _selelct.join('') + '</select></li>');
				}
				$container.html($ul);
			},
			bind: function(){
				$container.on('keyup','.pagenum',function(e){
					var _val = $(this).val(),
						_reg = /\D+/g;
					if(!_val){
						return;
					}
					_val = _val.replace(_reg,'');
					if(_val>opt.total){
						_val = opt.total;
					}
					if(_val<1){
						_val = 1;
					}
					$(this).val(_val);
					if(e.keyCode == 13){
						page.callback(_val);
					}
				});
				$container.on('click','.page',function(){
					var _val = $(this).text();
					page.callback(_val);
				});
				$container.on('click','.first',function(){
					if(opt.current<=1){
						return;
					}
					page.callback(1);
				});
				$container.on('click','.prev',function(){
					if(opt.current<=1){
						return;
					}
					var _val = opt.current - 1;
					_val = _val>0?_val:1;
					page.callback(_val);
				});
				$container.on('click','.next',function(){
					if(opt.current>=opt.total){
						return;
					}
					var _val = opt.current + 1;
					page.callback(_val);
				});
				$container.on('click','.last',function(){
					if(opt.current>=opt.total){
						return;
					}
					page.callback(opt.total);
				});
				$container.on('change','.select select',function(){
					var _val = $(this).val();
					if(_val == opt.current){
						return;
					}
					page.callback(_val);
				});
			},
			callback: function(val){
				if(!val || typeof(opt.callback) !== 'function'){
					return;
				}
				if(typeof(val)!="number"){
					opt.current = parseInt(val);
				}else{
					opt.current = val;
				}
			 	opt.callback(opt);
			}
		};
		page.init();
	};
});
